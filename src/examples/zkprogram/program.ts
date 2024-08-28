import {
  SelfProof,
  Field,
  ZkProgram,
  verify,
  Proof,
  JsonProof,
  Provable,
  Empty,
} from 'o1js';

let MyProgram = ZkProgram({
  name: 'example-with-output',
  publicOutput: Field,
  methods: {
    baseCase: {
      privateInputs: [],
      auxiliaryOutput: Field,
      async method() {
        return {
          auxiliaryOutput: Field(1),
          publicOutput: Field(1),
        };
      },
    },
  },
});
