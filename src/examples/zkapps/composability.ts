/**
 * zkApps composability
 */
import {
  Field,
  isReady,
  method,
  Mina,
  AccountUpdate,
  PrivateKey,
  SmartContract,
  state,
  State,
  Int64,
  Circuit,
  Bool,
} from 'snarkyjs';

const doProofs = true;

await isReady;

class OtherContract extends SmartContract {
  @method other() {
    /*     Field(1).assertEquals(Field(1));
    return Field(1); */
  }
}

class Adder extends SmartContract {
  @method approveX(update: AccountUpdate) {
    this.approve(update);
  }
}

// contract which calls the Adder, stores the result on chain & emits an event
class Caller extends SmartContract {
  @method call() {
    let adder = new Adder(adderAddress);

    let a = new OtherContract(otheraddress);
    //Circuit.log(other.self);
    let au = a.other();

    /*     let other = AccountUpdate.clone(a.self);
    other.body.authorizationKind = {
      isProved: Bool(false),
      isSigned: Bool(true),
    }; */
    let other = a.self; //AccountUpdate.createSigned(otherkey);
    Circuit.asProver(() => {
      console.log(other.toPretty());
    });
    adder.approveX(other);
  }
}

// script to deploy zkapps and do interactions

let Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);

// a test account that pays all the fees, and puts additional funds into the zkapp
let feePayer = Local.testAccounts[0].privateKey;

// the second contract's address
let adderKey = PrivateKey.random();
let adderAddress = adderKey.toPublicKey();
// the third contract's address
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();
let otherkey = PrivateKey.random();
let otheraddress = otherkey.toPublicKey();

let zkapp = new Caller(zkappAddress);
let adderZkapp = new Adder(adderAddress);
let otherzkapp = new OtherContract(otheraddress);
if (doProofs) {
  await OtherContract.compile();
  console.log('compile (adder)');
  await Adder.compile();
  console.log('compile (caller)');
  await Caller.compile();
}

console.log('deploy');
let tx = await Mina.transaction(feePayer, () => {
  // TODO: enable funding multiple accounts properly
  AccountUpdate.fundNewAccount(feePayer, {
    initialBalance: Mina.accountCreationFee().mul(2),
  });
  zkapp.deploy({ zkappKey });
  adderZkapp.deploy({ zkappKey: adderKey });
  otherzkapp.deploy({ zkappKey: otherkey });
});
await tx.send();

console.log('call interaction');
tx = await Mina.transaction(feePayer, () => {
  // we just call one contract here, nothing special to do
  zkapp.call();
});
console.log('proving (3 proofs.. can take a bit!)');
await tx.prove();
tx.sign([zkappKey, otherkey, adderKey]);

await tx.send();
