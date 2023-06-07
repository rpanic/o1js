import { getSnarky, withThreadPool } from './bindings/js/wrapper.js';
import snarkySpec from './bindings/js/snarky-class-spec.js';
import { proxyClasses } from './bindings/js/proxy.js';

export { Snarky, Ledger, shutdown, isReady, Pickles, Test, withThreadPool };
let isReadyBoolean = true;
let isReady = Promise.resolve();
let isItReady = () => isReadyBoolean;

function shutdown() {}

let { Snarky, Ledger, Pickles, Test } = proxyClasses(
  getSnarky,
  isItReady,
  snarkySpec
);
