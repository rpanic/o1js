happens when the authorizsation is either none_given (`Authorization.create()`) or a proof, where proof means that the account update has previously
been proven (through a zkapp method call).

`AccountUpdate.createSigned(key);` works fine however

The bug throws two errors

`panicked at 'called `Result::unwrap()`on an`Err` value: Error { kind: UnexpectedEof, message: "failed to fill whole buffer" }', src/arkworks/pasta_fp.rs:59:21`

and `RuntimeError: unreachable`

the error happens when we try to prove an account update

```
adMissingProofs()
addProof()
return await provers[i](publicInputFields, previousProofs);
```
