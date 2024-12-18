import { DelegationJson, PaymentJson } from '../sign-legacy.js';

// inputs and generated signatures from client_sdk/tests/test_signatures.js
export { signatures, payments, delegations, strings, keypair };

let keypair = {
  privateKey: 'EKFKgDtU3rcuFTVSEpmpXSkukjmX4cKefYREi6Sdsk7E7wsT7KRw',
  publicKey: 'B62qiy32p8kAKnny8ZFwoMhYpBppM1DWVCqAPBYNcXnsAHhnfAAuXgg',
};

let receiver = 'B62qrcFstkpqXww1EkSGrqMCwCNho86kuqBd4FrAAUsPxNKdiPzAUsy';

let newDelegate = 'B62qkfHpLpELqpMK6ZvUTJ5wRqKDRF3UHyJ4Kv3FU79Sgs4qpBnx5RR';

let payments: PaymentJson[] = [
  {
    body: { receiver, amount: '42' },
    common: {
      fee: '3',
      feePayer: keypair.publicKey,
      nonce: '200',
      validUntil: '10000',
      memo: 'this is a memo',
    },
  },
  {
    body: { receiver, amount: '2048' },
    common: {
      fee: '15',
      feePayer: keypair.publicKey,
      nonce: '212',
      validUntil: '305',
      memo: 'this is not a pipe',
    },
  },
  {
    body: { receiver, amount: '109' },
    common: {
      fee: '2001',
      feePayer: keypair.publicKey,
      nonce: '3050',
      validUntil: '9000',
      memo: 'blessed be the geek',
    },
  },
];

let delegations: DelegationJson[] = [
  {
    body: { newDelegate },
    common: {
      fee: '3',
      feePayer: keypair.publicKey,
      nonce: '10',
      validUntil: '4000',
      memo: 'more delegates, more fun',
    },
  },
  {
    body: { newDelegate },
    common: {
      fee: '10',
      feePayer: keypair.publicKey,
      nonce: '1000',
      validUntil: '8192',
      memo: 'enough stake to kill a vampire',
    },
  },
  {
    body: { newDelegate },
    common: {
      fee: '8',
      feePayer: keypair.publicKey,
      nonce: '1010',
      validUntil: '100000',
      memo: 'another memo',
    },
  },
];

let strings = [
  'this is a test',
  'this is only a test',
  'if this had been an actual emergency...',
];

/**
 * for each network (testnet, mainnet), these are the signatures for
 * - the 3 payments,
 * - the 3 stake delegations,
 * - the 3 strings.
 */
let signatures: { [k: string]: { field: string; scalar: string }[] } = {
  devnet: [
    {
      field:
        '3925887987173883783388058255268083382298769764463609405200521482763932632383',
      scalar:
        '445615701481226398197189554290689546503290167815530435382795701939759548136',
    },
    {
      field:
        '11838925242791061185900891854974280922359055483441419242429642295065318643984',
      scalar:
        '5057044820006008308046028014628135487302791372585541488835641418654652928805',
    },
    {
      field:
        '13570419670106759824217358880396743605262660069048455950202130815805728575057',
      scalar:
        '2256128221267944805514947515637443480133552241968312777663034361688965989223',
    },
    {
      field:
        '18603328765572408555868399359399411973012220541556204196884026585115374044583',
      scalar:
        '17076342019359061119005549736934690084415105419939473687106079907606137611470',
    },
    {
      field:
        '1786373894608285187089973929748850875336413409295396991315429715474432640801',
      scalar:
        '10435258496141097615588833319454104720521911644724923418749752896069542389757',
    },
    {
      field:
        '11710586766419351067338319607483640291676872446372400739329190129174446858072',
      scalar:
        '21663533922934564101122062377096487451020504743791218020915919810997397884837',
    },
    {
      field:
        '11583775536286847540414661987230057163492736306749717851628536966882998258109',
      scalar:
        '14787360096063782022566783796923142259879388947509616216546009448340181956495',
    },
    {
      field:
        '24809097509137086694730479515383937245108109696879845335879579016397403384488',
      scalar:
        '23723859937408726087117568974923795978435877847592289069941156359435022279156',
    },
    {
      field:
        '23803497755408154859878117448681790665144834176143832235351783889976460433296',
      scalar:
        '21219917886278462345652813021708727397787183083051040637716760620250038837684',
    },
  ],
  mainnet: [
    {
      field:
        '2290465734865973481454975811990842289349447524565721011257265781466170720513',
      scalar:
        '174718295375042423373378066296864207343460524320417038741346483351503066865',
    },
    {
      field:
        '3338221378196321618737404652850173545830741260219426985985110494623248154796',
      scalar:
        '13582570889626737053936904045130069988029386067840542224501137534361543053466',
    },
    {
      field:
        '24977166875850415387591601609169744956874881328889802588427412550673368014171',
      scalar:
        '8818176737844714163963728742657256399283959917269715546724011366788373936767',
    },
    {
      field:
        '18549185720796945285997801022505868190780742636917696085321477383695464941808',
      scalar:
        '9968155560235917784839059154575307851833761552720670659405850314060739412758',
    },
    {
      field:
        '27435277901837444378602251759261698832749786010721792798570593506489878524054',
      scalar:
        '5303814070856978976450674139278204752713705309497875510553816988969674317908',
    },
    {
      field:
        '18337925798749632162999573213504280894403810378974021233452576035581180265108',
      scalar:
        '17033350386680878193188260707518516061312646961349757526930471244219909355133',
    },
    {
      field:
        '15321026181887258084717253351692625217563887132804118766475695975434200286072',
      scalar:
        '27693688834009297019754701709097142916828669707451033859732637861400085816575',
    },
    {
      field:
        '7389839717736616673468176670823346848621475008909123730960586617430930011362',
      scalar:
        '16812002169649926565884427604872242188288298244442130642661893463581998776079',
    },
    {
      field:
        '25237307917208237775896283358517786348974681409860182331969894401303358790178',
      scalar:
        '1498643894425942815773348600211341433686244249442354387056510209608647184582',
    },
  ],
};
