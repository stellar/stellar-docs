---
name: zk-proofs
description: Zero-knowledge proofs and privacy patterns on Stellar. Covers Groth16 verification in smart contracts via BLS12-381 host functions (CAP-59), the BN254 + Poseidon host functions (CAP-74/75), and concrete toolchain walkthroughs for Circom, Noir, and RISC Zero. Use when building privacy-preserving applications, ZK-verifier contracts, or wiring a proving toolchain to Stellar.
user-invocable: true
argument-hint: "[zk task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Zero-Knowledge Proofs & Privacy

ZK verification on Stellar. Capability is protocol- and SDK-version dependent — always verify CAP status, network version, and `soroban-sdk` host-function support before relying on a primitive.

> **Last verified against Protocol 29** (mainnet, October 2026). CAP-0074/0075 shipped in Protocol 25 "X-Ray" and CAP-0080 (BN254 MSM, Fr arithmetic, on-curve checks) in Protocol 26 — if a doc tells you BN254 or Poseidon is "proposed", it predates that.

## When to use this skill
- Implementing a Groth16 (or other SNARK) verifier as a Stellar smart contract
- Wiring Circom, Noir, or RISC Zero output to on-chain verification
- Building privacy pools, confidential tokens, or Merkle-tree-backed commitments
- Using the BN254 / Poseidon host functions (Protocol 25+)

## Related skills
- Contract patterns and deployment → `/.well-known/agent-skills/smart-contracts/skill.md#development-patterns`
- Verifier security review → `/.well-known/agent-skills/smart-contracts/skill.md#security`
- CAPs referenced here → `/.well-known/agent-skills/standards/skill.md`

## What's available — verify before building

| Primitive | CAP | Status |
|-----------|-----|--------|
| BLS12-381 ops (G1/G2 add, mul, MSM, pairing check, hash-to-curve, Fr arithmetic) | [CAP-0059](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md) | **Available** (Protocol 22+) |
| BN254 base ops (G1 add/mul, pairing check — `crypto::bn254`) | [CAP-0074](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md) | **Available** (Protocol 25+) |
| BN254 G1 MSM, Fr arithmetic (`fr_add/sub/mul/pow/inv`), on-curve checks | [CAP-0080](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0080.md) | **Available** (Protocol 26+) |
| Poseidon/Poseidon2 **permutation** primitives (not complete hash functions) | [CAP-0075](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md) | **Available** (Protocol 25+) |

Before implementation, always confirm:
1. CAP status in the preamble (`Accepted`/`Implemented` vs draft)
2. Target network protocol version ([software versions](https://developers.stellar.org/docs/networks/software-versions))
3. `soroban-sdk` release support for the host functions you need

**Both curves have base host functions since Protocol 25** — the curve no longer decides everything. What still matters is the proof *system*: Groth16 verifies with a small contract on either curve, while UltraHonk needs a dedicated in-contract verifier (one exists — see the Noir walkthrough — but it relies on CAP-0080 host functions and its current release builds on `soroban-sdk` 28, so Protocol 28+).

| Toolchain | Proof system | Curve | On-chain on Stellar |
|-----------|--------------|-------|---------------------|
| Circom + snarkjs (`-p bls12381`) | Groth16 | BLS12-381 | ✅ via CAP-0059 (Protocol 22+) |
| Circom + snarkjs (default `bn128`) | Groth16 | BN254 | ✅ via CAP-0074 (Protocol 25+) |
| Noir + Barretenberg | UltraHonk | BN254 | ✅ via CAP-0074 + CAP-0080 (**Protocol 28+** for the current verifier release) — needs the [rs-soroban-ultrahonk](https://github.com/NethermindEth/rs-soroban-ultrahonk) verifier contract; **non-ZK proofs only** (see the Noir walkthrough) |
| RISC Zero (STARK → Groth16 wrap) | Groth16 | BN254 | ✅ via CAP-0074 (Protocol 25+) |

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

## Walkthrough: Circom → on-chain verification

Circom compiles for either curve. This walkthrough targets BLS12-381 to match the canonical verifier contract above; since Protocol 25 the default `bn128` (BN254) output is equally verifiable via `crypto::bn254` — just make sure circuit curve and verifier contract agree.

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

# 2. Compile for BLS12-381 to match the verifier contract above
#    (the default bn128 also verifies on-chain since Protocol 25 — via a BN254 verifier)
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

## Walkthrough: Noir (UltraHonk, on-chain verifiable on Protocol 28+)

Noir's standard backend (Barretenberg) produces UltraHonk proofs over BN254. The curve's base operations are native since Protocol 25 (CAP-0074), and UltraHonk verification runs on-chain through [Nethermind's rs-soroban-ultrahonk](https://github.com/NethermindEth/rs-soroban-ultrahonk) verifier contract, whose host calls include `env.crypto().bn254()`'s `g1_msm`, Fr arithmetic (`fr_add/sub/mul/pow/inv`) and `pairing_check` — the MSM and Fr functions come from CAP-0080 (Protocol 26). The current release, crate `ultrahonk_soroban_verifier` 0.1.0, depends on `soroban-sdk` ^28, and its README says contracts built with it need **Protocol 28+**. This is the stack OpenZeppelin's [Confidential Tokens developer preview](https://stellar.org/blog/developers/developer-preview-confidential-tokens-on-stellar) runs on (testnet). OpenZeppelin audited the verifier at an earlier commit (report dated 2026-09-18, no Critical/High/Medium findings, all findings resolved); the release adds later SDK upgrades, so the audited revision is not the release revision. Review that gap and the [audit report](https://github.com/NethermindEth/rs-soroban-ultrahonk/tree/main/audits) before mainnet use.

> **Non-ZK only.** The rs-soroban-ultrahonk verifier implements Barretenberg's non-zero-knowledge flavor (`UltraKeccakFlavor`). Its [README](https://github.com/NethermindEth/rs-soroban-ultrahonk/tree/main/crates/ultrahonk-soroban-verifier) says a proof gives **no witness-hiding guarantee**: a private circuit input is not secret just because it is not a public input. In the example below, the proof does not protect `age`. Use this verifier to prove that a statement holds, not to hide data. For hidden inputs on-chain today, use a Groth16 stack such as Circom. ZK verification is in progress in [PR #38](https://github.com/NethermindEth/rs-soroban-ultrahonk/pull/38).

The verifier README lists **Nargo 1.0.0-beta.9 + Barretenberg 0.87.0** with the Keccak oracle as its compatible proof tooling (`noirup -v 1.0.0-beta.9`, `bbup -v 0.87.0`). `bb` defaults to the Poseidon2 oracle, which this verifier rejects, so pass `--oracle_hash keccak` to every `bb` command. Do not pass `--zk`: it selects the ZK flavor, which the verifier does not support. Stay on 0.87.0: from `bb` 1.0.0 the default is the ZK flavor and `--disable_zk` replaces `--zk`, so these commands would produce proofs the verifier rejects.

```bash
# Local proving workflow (Nargo 1.0.0-beta.9, Barretenberg 0.87.0)
nargo new age_check && cd age_check
cat > src/main.nr <<'EOF'
fn main(age: u64, threshold: pub u64) {
    assert(age >= threshold);
}
EOF
cat > Prover.toml <<'EOF'
age = "30"
threshold = "18"
EOF
nargo execute witness          # compiles target/age_check.json, writes target/witness.gz
# -o is an output directory: prove writes target/proof + target/public_inputs, write_vk writes target/vk
bb prove --scheme ultra_honk --oracle_hash keccak -b target/age_check.json -w target/witness.gz -o target
bb write_vk --scheme ultra_honk --oracle_hash keccak -b target/age_check.json -o target
bb verify --scheme ultra_honk --oracle_hash keccak -k target/vk -p target/proof -i target/public_inputs   # off-chain check
```

Three ways to get a Noir statement on-chain, in order of preference:

1. **On-chain UltraHonk verification** (Protocol 28+ for the current verifier release; CAP-0074 + CAP-0080): deploy or call an [rs-soroban-ultrahonk](https://github.com/NethermindEth/rs-soroban-ultrahonk)-based verifier and submit `(proof, public inputs)` directly — trustless, no oracle.
2. **Switch the proving stack for on-chain parts**: express the on-chain-critical statement as a Circom/Groth16 circuit (walkthrough above) and keep Noir for off-chain components — smaller, battle-tested verifier at the cost of a second toolchain.
3. **Attestation oracle** (fallback for older protocol targets or verifier-audit concerns): a service runs `bb verify` off-chain and submits a signed attestation; the contract `require_auth()`s the attester and applies policy. The trust assumption (the attester) must be explicit and documented — this is *not* trustless ZK, it's a verifiable-computation oracle.

## Walkthrough: RISC Zero (Groth16 wrap, on-chain verifiable since Protocol 25)

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

Since Protocol 25 (CAP-0074), the Groth16-wrapped receipt verifies **natively on-chain**: a BN254 verifier contract mirroring the BLS12-381 one above. Its public inputs are *not* the `IMAGE_ID` and journal digest directly — RISC Zero's Groth16 verifier takes five field elements encoding the control root (split into two halves), the receipt-claim digest (also split in two), and the BN254 control ID. The image ID and journal are inputs to reconstructing that receipt claim off-chain (or in contract code) before the pairing check; binding them incorrectly rejects valid seals or proves the wrong statement. See the [RISC Zero docs](https://dev.risczero.com/api) for the wrapping workflow and claim-digest construction. The attestation pattern remains a fallback for STARK-only receipts (no Groth16 wrap) or pre-Protocol-25 targets.

## Architecture patterns

- **Verification gateway**: isolate cryptographic checks in a dedicated verifier contract/module — normalize inputs, verify, emit explicit success/failure events. Smaller audit surface, cleaner upgrades.
- **Policy-and-proof split**: `Verifier` (cryptographic validity) → `Policy` (business/compliance rules) → `Application` (state transition). Each independently testable and upgradeable.
- **Capability gating**: enable ZK flows only where required primitives are confirmed available; keep deterministic fallbacks and document the supported network/protocol matrix.

For Merkle-tree commitments (privacy pools, allowlists): CAP-0075 (Protocol 25+) exposes Poseidon/Poseidon2 **permutations**, not ready-made hash functions. To recompute Poseidon Merkle roots and commitments on-chain you must build the sponge/compression construction in guest code and pass the same field, state size `t`, S-box degree `d`, round counts, MDS/diagonal matrix, and round constants your circuit uses — plus matching padding and domain separation. Mismatched parameters silently produce roots that differ from the circuit's, and an ad-hoc construction can be insecure. On pre-Protocol-25 targets, design trees so the contract only needs root comparisons and membership proofs verified inside the SNARK.

## Pitfalls

- **Verifying the proof but not the statement.** A valid proof only shows *some* witness satisfies the circuit. The contract must validate the public inputs' semantics: who is this proof for, which Merkle root, which action, which amount.
- **Missing anti-replay binding.** Valid proofs can be replayed. Bind a nonce/session/action into the public inputs and persist a replay guard (nullifier set) on-chain.
- **Curve/verifier mismatch.** The proof's curve must match the verifier contract's host functions: the canonical example verifier is BLS12-381, so a default-`bn128` Circom proof fails against it (and vice versa for a BN254 verifier). Since Protocol 25 both curves work — just keep circuit and verifier on the same one.
- **Assuming a proof hides its private inputs.** Only a zero-knowledge proof does. The on-chain UltraHonk verifier accepts non-ZK proofs only, so do not use it for privacy-sensitive circuits until it supports the ZK flavor.
- **Trusted-setup hygiene.** Groth16 needs a circuit-specific phase-2 setup; for production use a real multi-party ceremony, not a single-contributor dev setup.
- **Hardcoded protocol assumptions.** Capability-gate; don't assume draft CAPs are live on the target network.

## Testing

- Unit: input domain validation, replay protection, event correctness, malformed/tampered proof rejection (negative paths are the important ones)
- Integration: full prove → submit → verify → state-transition flow against a local network
- Operational: resource costs for realistic proof sizes via simulation (`--send=no`) — pairing checks are expensive; budget before committing to per-transaction verification

## References

- [groth16_verifier example](https://github.com/stellar/soroban-examples/tree/main/groth16_verifier) — canonical verifier + arkworks test fixtures
- [soroban-examples](https://github.com/stellar/soroban-examples)
- [ZK Proofs on Stellar](https://developers.stellar.org/docs/build/apps/zk) · [Privacy on Stellar](https://developers.stellar.org/docs/build/apps/privacy) — official docs
- [rs-soroban-ultrahonk](https://github.com/NethermindEth/rs-soroban-ultrahonk) — UltraHonk/BN254 verifier contract
- [BLS12-381 SDK docs](https://docs.rs/soroban-sdk/latest/soroban_sdk/crypto/bls12_381/index.html) · [BN254 SDK docs](https://docs.rs/soroban-sdk/latest/soroban_sdk/crypto/bn254/index.html)
- [Circom docs](https://docs.circom.io) · [snarkjs](https://github.com/iden3/snarkjs) · [Noir docs](https://noir-lang.org/docs) · [RISC Zero docs](https://dev.risczero.com)
