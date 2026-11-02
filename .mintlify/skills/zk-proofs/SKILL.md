---
name: zk-proofs
description: Zero-knowledge proofs and privacy patterns on Stellar. Covers Groth16 verification in smart contracts via BLS12-381 host functions (CAP-0059, available), the BN254 + Poseidon proposals (CAP-0074/0075, status-sensitive), and concrete toolchain walkthroughs for Circom (on-chain verifiable today), Noir, and RISC Zero (attestation pattern until BN254 lands). Use when building privacy-preserving applications, ZK-verifier contracts, or wiring a proving toolchain to Stellar.
user-invocable: true
argument-hint: "[zk task]"
---

# Zero-Knowledge Proofs & Privacy

ZK verification on Stellar. Capability is protocol- and SDK-version dependent — always verify CAP status, network version, and `soroban-sdk` host-function support before relying on a primitive.

## When to use this skill
- Implementing a Groth16 (or other SNARK) verifier as a Stellar smart contract
- Wiring Circom, Noir, or RISC Zero output to on-chain verification
- Building privacy pools, confidential tokens, or Merkle-tree-backed commitments
- Planning for BN254 / Poseidon availability

## Related skills
- Contract patterns and deployment → `/.well-known/agent-skills/smart-contracts/skill.md#development-patterns`
- Verifier security review → `/.well-known/agent-skills/smart-contracts/skill.md#security`
- CAPs referenced here → `/.well-known/agent-skills/standards/skill.md`

## What's available — verify before building

| Primitive | CAP | Status |
|-----------|-----|--------|
| BLS12-381 ops (G1/G2 add, mul, MSM, pairing check, hash-to-curve, Fr arithmetic) | [CAP-0059](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md) | **Available** (Protocol 22+) |
| BN254 host functions | [CAP-0074](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md) | Proposed — check current status |
| Poseidon/Poseidon2 hash | [CAP-0075](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md) | Proposed — check current status |

Before implementation, always confirm:
1. CAP status in the preamble (`Accepted`/`Implemented` vs draft)
2. Target network protocol version ([software versions](https://developers.stellar.org/docs/networks/software-versions))
3. `soroban-sdk` release support for the host functions you need

**The curve decides everything.** BLS12-381 proofs verify natively on-chain today; BN254 proofs (Circom's default, Barretenberg, RISC Zero's Groth16 wrapper) are gated on CAP-0074.

| Toolchain | Proof system | Curve | On-chain on Stellar |
|-----------|--------------|-------|---------------------|
| Circom + snarkjs (`-p bls12381`) | Groth16 | BLS12-381 | ✅ Today, via CAP-0059 |
| Circom + snarkjs (default) | Groth16 | BN254 | Gated on CAP-0074 |
| Noir + Barretenberg | UltraHonk | BN254 | Not yet — attest off-chain verification |
| RISC Zero (STARK → Groth16 wrap) | Groth16 | BN254 | Gated on CAP-0074 — attest meanwhile |

## The on-chain verifier (Groth16 over BLS12-381)

The official [groth16_verifier example](https://github.com/stellar/soroban-examples/tree/main/groth16_verifier) is the canonical implementation — the full contract:

```rust
#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    crypto::bls12_381::{Fr, G1Affine, G2Affine},
    vec, Env, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Groth16Error {
    MalformedVerifyingKey = 0,
}

#[derive(Clone)]
#[contracttype]
pub struct VerificationKey {
    pub alpha: G1Affine,
    pub beta: G2Affine,
    pub gamma: G2Affine,
    pub delta: G2Affine,
    pub ic: Vec<G1Affine>,
}

#[derive(Clone)]
#[contracttype]
pub struct Proof {
    pub a: G1Affine,
    pub b: G2Affine,
    pub c: G1Affine,
}

#[contract]
pub struct Groth16Verifier;

#[contractimpl]
impl Groth16Verifier {
    pub fn verify_proof(
        env: Env,
        vk: VerificationKey,
        proof: Proof,
        pub_signals: Vec<Fr>,
    ) -> Result<bool, Groth16Error> {
        let bls = env.crypto().bls12_381();

        // vk_x = ic[0] + sum(pub_signals[i] * ic[i+1])
        if pub_signals.len() + 1 != vk.ic.len() {
            return Err(Groth16Error::MalformedVerifyingKey);
        }
        let mut vk_x = vk.ic.get(0).unwrap();
        for (s, v) in pub_signals.iter().zip(vk.ic.iter().skip(1)) {
            let prod = bls.g1_mul(&v, &s);
            vk_x = bls.g1_add(&vk_x, &prod);
        }

        // e(-A, B) * e(alpha, beta) * e(vk_x, gamma) * e(C, delta) == 1
        let neg_a = -proof.a;
        let vp1 = vec![&env, neg_a, vk.alpha, vk_x, proof.c];
        let vp2 = vec![&env, proof.b, vk.beta, vk.gamma, vk.delta];

        Ok(bls.pairing_check(vp1, vp2))
    }
}
```

Point encodings are uncompressed big-endian: `G1Affine` wraps 96 bytes, `G2Affine` 192 bytes, `Fr` 32 bytes. The example's test suite shows the exact conversion from arkworks types (`ark-bls12-381` + `ark-serialize`) — reuse it when building fixtures from your proving toolchain's JSON output.

In production, wrap this verifier with application logic: fix the `VerificationKey` at deploy time (constructor) instead of taking it as a call argument, and bind proofs to context (see [Pitfalls](#pitfalls)).

## Walkthrough: Circom → on-chain verification (works today)

Circom supports BLS12-381 as a target field — this makes it the toolchain that verifies natively on Stellar right now.

```bash
# 1. Circuit
cat > multiplier.circom <<'EOF'
pragma circom 2.1.6;
template Multiplier() {
    signal input a;
    signal input b;
    signal output c;
    c <== a * b;
}
component main = Multiplier();
EOF

# 2. Compile for BLS12-381 (NOT the default bn128 — that's gated on CAP-0074)
circom multiplier.circom --r1cs --wasm -p bls12381

# 3. Trusted setup (powers of tau on bls12-381, then circuit-specific phase 2)
snarkjs powersoftau new bls12-381 12 pot12_0000.ptau
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="contrib" -e="random"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau
snarkjs groth16 setup multiplier.r1cs pot12_final.ptau multiplier.zkey
snarkjs zkey export verificationkey multiplier.zkey verification_key.json

# 4. Witness + proof
echo '{"a": 3, "b": 11}' > input.json
node multiplier_js/generate_witness.js multiplier_js/multiplier.wasm input.json witness.wtns
snarkjs groth16 prove multiplier.zkey witness.wtns proof.json public.json

# 5. Sanity-check off-chain before going on-chain
snarkjs groth16 verify verification_key.json public.json proof.json
```

Then convert `proof.json` / `verification_key.json` (decimal-string coordinates) into the contract's types — serialize each point uncompressed big-endian into the 96/192-byte layouts, e.g. via arkworks as in the example's tests — and invoke `verify_proof`. Public signals (`public.json`) become the `Vec<Fr>` argument; the contract must also validate what those signals *mean* (see [Pitfalls](#pitfalls)).

For real applications the per-proof flow is: client proves locally (WASM prover or native), submits `(proof, public_signals)` in a contract invocation, contract verifies + applies policy + updates state.

## Walkthrough: Noir (off-chain verify + attestation, for now)

Noir's standard backend (Barretenberg) produces UltraHonk proofs over BN254 — neither the proof system nor the curve is on-chain verifiable on Stellar today.

```bash
# Local proving workflow
nargo new age_check && cd age_check
cat > src/main.nr <<'EOF'
fn main(age: u64, threshold: pub u64) {
    assert(age >= threshold);
}
EOF
nargo check
nargo execute witness          # writes the witness from Prover.toml inputs
bb prove -b target/age_check.json -w target/witness.gz -o target/proof
bb verify -k target/vk -p target/proof   # off-chain verification
```

On Stellar, two patterns until the curve/system gap closes:

1. **Attestation oracle**: a verifier service runs `bb verify` (or the Noir JS verifier) off-chain and submits a signed attestation; the contract `require_auth()`s the attester address and applies policy. The trust assumption (the attester) must be explicit and documented — this is *not* trustless ZK, it's a verifiable-computation oracle.
2. **Switch the proving stack for on-chain parts**: express the on-chain-critical statement as a Circom/Groth16-BLS12-381 circuit (walkthrough above) and keep Noir for off-chain components.

Track CAP-0074 (BN254): when implemented, BN254 Groth16 verification becomes possible — but UltraHonk would additionally need a verifier implementation in-contract, so Groth16-based paths will land first.

## Walkthrough: RISC Zero (same gate, clear path)

RISC Zero proves arbitrary Rust execution (zkVM) and can wrap its STARK receipts into a Groth16 proof over BN254 ("stark-to-snark") — small enough for on-chain verification where BN254 is supported.

```rust
// Guest (runs inside the zkVM): the computation being proven
use risc0_zkvm::guest::env;

fn main() {
    let input: u64 = env::read();
    let result = expensive_check(input);
    env::commit(&result);          // becomes part of the public journal
}
```

```rust
// Host: produce and verify a receipt locally
let receipt = prover.prove(env, ELF)?.receipt;
receipt.verify(IMAGE_ID)?;         // off-chain verification
```

On Stellar today, use the **attestation pattern** (as with Noir): verify the receipt off-chain — locally or via a proving service — and have an authorized attester submit the journal + attestation to your contract. Once CAP-0074 (BN254) is implemented, the Groth16-wrapped receipt becomes verifiable natively with a BN254 verifier contract mirroring the BLS12-381 one above; the `IMAGE_ID` (which program ran) and journal digest become public inputs. See the [RISC Zero docs](https://dev.risczero.com/api) for the wrapping workflow.

## Architecture patterns

- **Verification gateway**: isolate cryptographic checks in a dedicated verifier contract/module — normalize inputs, verify, emit explicit success/failure events. Smaller audit surface, cleaner upgrades.
- **Policy-and-proof split**: `Verifier` (cryptographic validity) → `Policy` (business/compliance rules) → `Application` (state transition). Each independently testable and upgradeable.
- **Capability gating**: enable ZK flows only where required primitives are confirmed available; keep deterministic fallbacks and document the supported network/protocol matrix.

For Merkle-tree commitments (privacy pools, allowlists): until Poseidon (CAP-0075) lands, in-circuit-friendly hashing on-chain is expensive — design trees so the contract only needs root comparisons and membership proofs verified inside the SNARK.

## Pitfalls

- **Verifying the proof but not the statement.** A valid proof only shows *some* witness satisfies the circuit. The contract must validate the public inputs' semantics: who is this proof for, which Merkle root, which action, which amount.
- **Missing anti-replay binding.** Valid proofs can be replayed. Bind a nonce/session/action into the public inputs and persist a replay guard (nullifier set) on-chain.
- **Curve mismatch.** Circom defaults to bn128; on Stellar compile with `-p bls12381` or your proof will be unverifiable on-chain.
- **Trusted-setup hygiene.** Groth16 needs a circuit-specific phase-2 setup; for production use a real multi-party ceremony, not a single-contributor dev setup.
- **Hardcoded protocol assumptions.** Capability-gate; don't assume draft CAPs are live on the target network.

## Testing

- Unit: input domain validation, replay protection, event correctness, malformed/tampered proof rejection (negative paths are the important ones)
- Integration: full prove → submit → verify → state-transition flow against a local network
- Operational: resource costs for realistic proof sizes via simulation (`--send=no`) — pairing checks are expensive; budget before committing to per-transaction verification

## References

- [groth16_verifier example](https://github.com/stellar/soroban-examples/tree/main/groth16_verifier) — canonical verifier + arkworks test fixtures
- [soroban-examples](https://github.com/stellar/soroban-examples)
- [BLS12-381 SDK docs](https://docs.rs/soroban-sdk/latest/soroban_sdk/crypto/bls12_381/index.html)
- [Circom docs](https://docs.circom.io) · [snarkjs](https://github.com/iden3/snarkjs) · [Noir docs](https://noir-lang.org/docs) · [RISC Zero docs](https://dev.risczero.com)
