import { DynamicProof, Void, Field, ZkProgram, Provable, VerificationKey } from "../index.js"

const program1 = ZkProgram({
    name: "program1",
    methods: {
        foo: {
            privateInputs: [Field],
            method(pi: Field, field: Field) {
                pi.assertEquals(field)
            },
        }
    },
    publicInput: Field
})

class SampleSideloadedProof extends DynamicProof<Field, Void> {
    static tag: () => { name: "sideloaded1" };

    static publicInputType = Field;
    static publicOutputType = Void;
}

const program2 = ZkProgram({
    name: "program2",
    publicInput: Field,
    methods: {
        bar: {
            privateInputs: [SampleSideloadedProof, VerificationKey],
            method(pi: Field, proof: SampleSideloadedProof, vk: VerificationKey) {
                proof.verify(vk);

                proof.publicInput.assertEquals(pi, "Pi not matching")
            }
        }
    }
})

console.log("compiling")
const result = await program1.compile()
console.log("VK: " + result.verificationKey);
const proof = await program1.foo(Field(1), Field(1))
console.log("Proof:")
console.log(proof.toJSON())

expect(1).toBe(1);

describe("sideloaded", () => {
    it.only("generate sample proof", async () => {
        console.log("compiling")
        const result = await program1.compile()
        console.log("VK: " + result.verificationKey);
        const proof = await program1.foo(Field(1), Field(1))
        console.log("Proof:")
        console.log(proof.toJSON())
    })

    it("use sample proof and vk with zkprogram", async () => {
        const proofT = SampleSideloadedProof.fromJSON({} as any);
        const proof = new SampleSideloadedProof({
            proof: proofT.proof,
            maxProofsVerified: proofT.maxProofsVerified,
            publicInput: proofT.publicInput,
            publicOutput: undefined,
        })

        const vk = VerificationKey.fromJSON({} as any);
        
        const result = await program2.compile();

        const proof2 = await program2.bar(Field(1), proof, vk);

        console.log("Proof:")
        console.log(proof.toJSON())
    })
})