import {
  isReady,
  Mina,
  AccountUpdate,
  UInt64,
  shutdown,
  Token,
  Permissions,
} from 'snarkyjs';
import { createDex, TokenContract, addresses, keys, tokenIds } from './dex.js';
import { expect } from 'expect';
import { atomicActionsTest, upgradeabilityTests } from './upgradability.js';

await isReady;
let doProofs = false;

let Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
let accountFee = Mina.accountCreationFee();
let [{ privateKey: feePayerKey }] = Local.testAccounts;
let tx, balances, oldBalances;
let feePayerAddress = feePayerKey.toPublicKey();

console.log('-------------------------------------------------');
console.log('FEE PAYER\t', feePayerAddress.toBase58());
console.log('TOKEN X ADDRESS\t', addresses.tokenX.toBase58());
console.log('TOKEN Y ADDRESS\t', addresses.tokenY.toBase58());
console.log('DEX ADDRESS\t', addresses.dex.toBase58());
console.log('USER ADDRESS\t', addresses.user.toBase58());
console.log('-------------------------------------------------');
console.log('TOKEN X ID\t', Token.Id.toBase58(tokenIds.X));
console.log('TOKEN Y ID\t', Token.Id.toBase58(tokenIds.Y));
console.log('-------------------------------------------------');

console.log('compile (token)...');
await TokenContract.compile();

await main({ withVesting: false });

// swap out ledger so we can start fresh
Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
[{ privateKey: feePayerKey }] = Local.testAccounts;
feePayerAddress = feePayerKey.toPublicKey();

await main({ withVesting: true });

console.log('starting atomic actions tests');

await atomicActionsTest({
  withVesting: false,
});

console.log('all atomic actions tests were successful!');

console.log('starting upgradeability tests');

await upgradeabilityTests({
  withVesting: false,
});
console.log('all upgradeability tests were successful! 🎉');

console.log('all dex tests were successful! 🎉');

async function main({ withVesting }: { withVesting: boolean }) {
  if (withVesting) console.log('\nWITH VESTING');
  else console.log('\nNO VESTING');

  let options = withVesting ? { lockedLiquiditySlots: 2 } : undefined;
  let { Dex, DexTokenHolder, getTokenBalances } = createDex(options);

  // analyze methods for quick error feedback
  DexTokenHolder.analyzeMethods();
  Dex.analyzeMethods();

  // compile & deploy all zkApps
  console.log('compile (dex token holder)...');
  await DexTokenHolder.compile();
  console.log('compile (dex main contract)...');
  await Dex.compile();

  let tokenX = new TokenContract(addresses.tokenX);
  let tokenY = new TokenContract(addresses.tokenY);
  let dex = new Dex(addresses.dex);

  console.log('deploy & init token contracts...');
  tx = await Mina.transaction({ feePayerKey }, () => {
    // pay fees for creating 2 token contract accounts, and fund them so each can create 2 accounts themselves
    let feePayerUpdate = AccountUpdate.createSigned(feePayerKey);
    feePayerUpdate.balance.subInPlace(accountFee.mul(2));
    feePayerUpdate.send({ to: addresses.tokenX, amount: accountFee.mul(2) });
    feePayerUpdate.send({ to: addresses.tokenY, amount: accountFee.mul(2) });
    tokenX.deploy();
    tokenY.deploy();
  });
  await tx.prove();
  tx.sign([keys.tokenX, keys.tokenY]);
  await tx.send();
  balances = getTokenBalances();
  console.log(
    'Token contract tokens (X, Y):',
    balances.tokenContract.X,
    balances.tokenContract.Y
  );

  console.log('deploy dex contracts...');
  tx = await Mina.transaction(feePayerKey, () => {
    // pay fees for creating 3 dex accounts
    AccountUpdate.createSigned(feePayerKey).balance.subInPlace(
      accountFee.mul(3)
    );
    dex.deploy();
    tokenX.deployZkapp(addresses.dex, DexTokenHolder._verificationKey!);
    tokenY.deployZkapp(addresses.dex, DexTokenHolder._verificationKey!);
  });
  await tx.prove();
  tx.sign([keys.dex]);
  await tx.send();

  console.log('transfer tokens to user');
  tx = await Mina.transaction({ feePayerKey, fee: accountFee.mul(1) }, () => {
    let feePayer = AccountUpdate.createSigned(feePayerKey);
    feePayer.balance.subInPlace(Mina.accountCreationFee().mul(4));
    feePayer.send({ to: addresses.user, amount: 20e9 }); // give users MINA to pay fees
    feePayer.send({ to: addresses.user2, amount: 20e9 });
    // transfer to fee payer so they can provide initial liquidity
    tokenX.transfer(addresses.tokenX, feePayerAddress, UInt64.from(10_000));
    tokenY.transfer(addresses.tokenY, feePayerAddress, UInt64.from(10_000));
    // mint tokens to the user (this is additional to the tokens minted at the beginning, so we can overflow the balance
    tokenX.init2();
    tokenY.init2();
  });
  await tx.prove();
  tx.sign([keys.tokenX, keys.tokenY]);
  await tx.send();
  [oldBalances, balances] = [balances, getTokenBalances()];
  console.log('User tokens (X, Y):', balances.user.X, balances.user.Y);
  console.log('User MINA:', balances.user.MINA);

  // supply the initial liquidity where the token ratio can be arbitrary
  console.log('supply liquidity -- base');
  tx = await Mina.transaction({ feePayerKey, fee: accountFee.mul(1) }, () => {
    AccountUpdate.fundNewAccount(feePayerKey);
    dex.supplyLiquidityBase(
      feePayerAddress,
      UInt64.from(10_000),
      UInt64.from(10_000)
    );
  });
  await tx.prove();
  tx.sign([feePayerKey]);
  await tx.send();
  [oldBalances, balances] = [balances, getTokenBalances()];
  console.log('DEX liquidity (X, Y):', balances.dex.X, balances.dex.Y);

  Local.setProofsEnabled(true);

  let USER_DX = 10n;
  console.log('swap 10 X for Y');
  tx = await Mina.transaction(keys.user, () => {
    dex.swapX(addresses.user, UInt64.from(USER_DX));
  });
  await tx.prove();
  await tx.sign([keys.user]).send();
  [oldBalances, balances] = [balances, getTokenBalances()];
  console.log('User tokens (X, Y):', balances.user.X, balances.user.Y);
}

shutdown();
