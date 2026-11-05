---
name: smart-contracts
description: Stellar smart contract development (Rust, soroban-sdk). Entry point with project setup, contract anatomy, and build/deploy workflow, routing to three companion files in this directory — development.md (storage/TTL, authorization, cross-contract calls, tokens, events, errors, upgrades, fees, troubleshooting), testing.md (unit, fuzz, property, fork, mutation, integration), and security.md (vulnerability classes, checklists, tooling, audits). Use when writing, testing, reviewing, securing, debugging, or shipping Stellar smart contracts, including anything the user calls "Soroban" — Soroban contracts, soroban-sdk, Soroban auth/storage/TTL errors, SEP-41 tokens, or SAC integration from contract code.
user-invocable: true
argument-hint: "[contract task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Stellar Smart Contracts

Guide for building Stellar smart contracts in Rust. Smart contracts on Stellar were formerly branded "Soroban" — the platform name is retired, but the Rust SDK (`soroban-sdk`) and several tool names keep the prefix.

This file covers setup and the core workflow. The deep dives are included below — **jump to the section that matches the task**:

| Task | Section |
|------|------|
| Storage/TTL, authorization, constructors, cross-contract calls, tokens, events, errors, upgrades, factories, governance/DeFi patterns, fees/resources, troubleshooting | [Development Patterns](#development-patterns) |
| Unit, integration, fuzz, property, fork, and mutation testing | [Testing](#testing) |
| Security review, vulnerability classes, checklists, audit prep, tooling | [Security](#security) |

## When to use this skill
- Writing a Stellar smart contract in Rust
- Setting up contract tests (any layer)
- Reviewing a contract for security issues
- Architecting upgradeable contracts, factories, custom accounts, or DeFi primitives
- Debugging a contract-specific error (auth, storage, archival, resource limits)

## Related skills
- Asset issuance, trustlines, and SAC deployment → `/.well-known/agent-skills/assets/skill.md`
- Frontend/wallets that call your contract → `/.well-known/agent-skills/dapp/skill.md`
- Chain data queries (RPC/Horizon) → `/.well-known/agent-skills/data/skill.md`
- ZK verification (BLS12-381, Groth16, Circom/Noir/RISC Zero) → `/.well-known/agent-skills/zk-proofs/skill.md`
- SEP/CAP standards and ecosystem links → `/.well-known/agent-skills/standards/skill.md`

## Versions

This skill was written against **protocol 29** (`soroban-sdk` v29, `rs-soroban-env` v29, `stellar-cli` v28). Version numbers in examples are illustrative — resolve the current ones from these sources rather than trusting any doc:

- **`soroban-sdk` major version tracks the protocol version** (SDK 29 ↔ protocol 29). This rule outlives any specific release.
- **Build with `stellar contract build`** (`stellar-cli` v25.2.0+). From `soroban-sdk` 28, a plain `cargo build` for a Wasm target stops with an error, because the CLI must strip unreachable spec entries after compiling. Native `cargo test` is unaffected.
- Latest SDK release: [crates.io/crates/soroban-sdk](https://crates.io/crates/soroban-sdk) (or `cargo add soroban-sdk`, which resolves it). Pre-releases (`-rc.x`) exist only during a protocol rollout and must be pinned with the exact version string; [GitHub releases](https://github.com/stellar/rs-soroban-sdk/releases) lists them with changelogs.
- Networks upgrade by validator vote, testnet before mainnet — pin the SDK major matching the network you deploy to. Live protocol version: RPC `getVersionInfo` or [Stellar Lab](https://lab.stellar.org).
- Numeric network limits quoted here are mainnet settings at time of writing; they change by vote — [Stellar Lab's Network Limits page](https://lab.stellar.org/network-limits) and `stellar network settings --network mainnet` show the live values.

## Platform constraints

Contracts are Rust compiled to WebAssembly, run in a sandboxed host:

- `#![no_std]` required — use `soroban_sdk` types (`String`, `Vec`, `Map`, `Symbol`), not the Rust standard library
- Compile for the **`wasm32v1-none`** target (Rust ≥ 1.84) — the only Wasm target the Stellar runtime supports
- 128KB compiled contract size limit (network-configured)
- `Symbol` is limited to 32 characters (`a-zA-Z0-9_`); `symbol_short!()` covers up to 9
- Storage is rented: every entry has a TTL and can be archived — see [development.md](#storage)
- No `delegatecall`, and cross-contract reentrancy is blocked by the host — see [Security](#security)
- No I/O, no networking, no clock beyond the ledger timestamp — everything a contract can do hangs off `Env`

## Project setup

```bash
stellar contract init my-contract   # scaffolds a Cargo workspace with contracts/
cd my-contract
rustup target add wasm32v1-none     # once per toolchain
```

`Cargo.toml` essentials (what `stellar contract init` generates):

```toml
[lib]
crate-type = ["lib", "cdylib"]   # lib is needed for tests and fuzzing

[dependencies]
soroban-sdk = "29"  # match the protocol of the network you deploy to.
                    # Pre-releases (`-rc.x`) exist only during a rollout and need the
                    # exact version string. Check crates.io for the latest release, and
                    # the live protocol version of your target network, before deploying.

[dev-dependencies]
soroban-sdk = { version = "29", features = ["testutils"] }  # match above

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true
```

## Contract anatomy

One compact example showing state, constructor, auth, TTL, a typed error, and an event:

```rust
#![no_std]
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, Address, Env,
};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Counter,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
}

// Emitted as topics ("incremented", by) with data {count} — #[topic] fields
// become topics, the rest go in the data payload.
#[contractevent]
pub struct Incremented {
    #[topic]
    pub by: Address,
    pub count: u32,
}

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    // Runs once, atomically, at deploy time. Must be named `__constructor`.
    // Does not run again on upgrade.
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Counter, &0u32);
    }

    pub fn increment(env: Env) -> Result<u32, Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let count: u32 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        let count = count + 1;
        env.storage().instance().set(&DataKey::Counter, &count);

        // Extend TTL so contract state is not archived (threshold, extend-to)
        env.storage().instance().extend_ttl(120 * 17280, 180 * 17280);

        Incremented { by: admin, count }.publish(&env);
        Ok(count)
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
    }
}
```

Full patterns (three storage types, auth variants, cross-contract calls, tokens, custom types): [Development Patterns](#development-patterns).

## Build, deploy, invoke

```bash
# Build optimized WASM → target/wasm32v1-none/release/*.wasm
# (optimization is on by default; --optimize=false to disable)
stellar contract build

# Create and fund an identity (testnet)
stellar keys generate alice --network testnet --fund

# Deploy (constructor args go after the `--`)
stellar contract deploy \
  --wasm target/wasm32v1-none/release/my_contract.wasm \
  --source-account alice \
  --network testnet \
  -- \
  --admin alice

# Invoke
stellar contract invoke \
  --id CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- \
  increment
```

To upload WASM without instantiating (e.g. for factories or upgrades), use `stellar contract upload` (the older `stellar contract install` is a deprecated alias).

## Verify your build

Nothing on-chain ties a deployed WASM to its source. [SEP-0055](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md) (Draft) closes that gap: build in GitHub Actions, stamp the source repository into the WASM's `contractmetav0` section, and publish a [GitHub build attestation](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations) over the binary — anyone can then walk from the on-chain WASM hash back to the commit and the workflow run that produced it. Verifiers read the attestation from `api.github.com/repos/<owner>/<repo>/attestations/sha256:<wasm-hash>` unauthenticated, so the source repository has to be public for that "anyone" to hold. On the Free, Pro, and Team plans a private or internal repo cannot publish an attestation at all. Enterprise Cloud can, but only accounts with repository access read it, so no user of your contract can. Make it a standard step before **any** mainnet deploy; it costs one workflow file, so there's no reason to reserve it for user-facing contracts.

Two metadata entries carry it (`stellar contract build --meta key=value`, read back with `stellar contract info meta --wasm <file>`):

- `source_repo=github:<owner>/<repo>` — where the source lives
- `home_domain=<domain>` — domain serving your SEP-1 `stellar.toml`, for org/token lookup (optional; bare domain, no scheme or path)

[soroban-build-workflow](https://github.com/stellar-expert/soroban-build-workflow) does the whole job — build with the metadata, optimize, attest, publish a release with the WASM attached, and register the build with stellar.expert's contract validation.

Resolve its version yourself instead of copying a pin out of any documentation, this file included. Pins go stale, and the newest tag in that repo is not always a published release:

```bash
REPO=stellar-expert/soroban-build-workflow
TAG=$(gh release view --repo "$REPO" --json tagName --jq .tagName)  # latest release
SHA=$(gh api "repos/$REPO/commits/$TAG" --jq .sha)                  # its commit
gh api "repos/$REPO/contents/.github/workflows/release.yml?ref=$SHA" \
  -H "Accept: application/vnd.github.raw"                           # the file you will pin
```

Read `release.yml` at that SHA, never at the tag. A tag can move between the two steps, and then you review one commit and pin another. It should check out the tagged commit, build from source, and attest the same file it uploads. If it doesn't, stop and tell the user rather than pinning it anyway. Then pin that full SHA, because this workflow runs with your repository token, OIDC, and attestation permissions.

Tell the user where that pin stops. It freezes `release.yml`, not the actions `release.yml` calls. Those sit on mutable tags of their own (`actions/checkout@v4`, the CLI, the attest action) and resolve at run time under the same permissions, and a caller cannot pin them. Fork the workflow if that residual risk is unacceptable.

```yaml
# .github/workflows/release.yml — verified build on every version tag
name: Build and Release
on:
  push:
    tags: ["v*"]

permissions:            # inherited by the called workflow, which cannot elevate them
  contents: write       # create the release, attach the WASM
  id-token: write       # sign the attestation
  attestations: write   # publish it

jobs:
  release:
    # the SHA you resolved and reviewed; keep the version in the comment
    uses: stellar-expert/soroban-build-workflow/.github/workflows/release.yml@<commit-sha>  # vX.Y.Z
    with:
      release_name: ${{ github.ref_name }}
      home_domain: example.com   # optional
      package: my-contract       # optional — omit to build the working directory
    secrets:
      release_token: ${{ secrets.GITHUB_TOKEN }}   # created by GitHub, nothing to configure
```

Then deploy **the WASM attached to that release**, not a local rebuild — compilation environments vary, and a hash that differs by one byte matches no attestation.

The result shows up in [Stellar Lab's contract explorer](https://developers.stellar.org/docs/tools/lab/smart-contracts/contract-explorer#build-info) and on stellar.expert. Be precise with users about what it proves: a specific workflow run built this binary from this commit. It says nothing about whether that code is safe or was ever reviewed.

## Minimal test

```rust
// src/test.rs — included from lib.rs with `mod test;`
#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_increment() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register(CounterContract, (admin.clone(),));
    let client = CounterContractClient::new(&env, &contract_id);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.get_count(), 1);
}
```

Auth mocking, event assertions, fuzzing, fork tests, and CI setup: [Testing](#testing).

## Before mainnet

Work through the checklists in [Security](#security) — authorization, reinitialization, arithmetic, storage TTLs, and cross-contract validation are the recurring failure modes. Ship the deploy through a [verified build](#verify-your-build) so the on-chain WASM hash traces back to a reviewable commit.

## Documentation

- [Smart contract docs](https://developers.stellar.org/docs/build/smart-contracts)
- [Example contracts](https://github.com/stellar/soroban-examples)
- [soroban-sdk API reference](https://docs.rs/soroban-sdk)
- [Stellar CLI manual](https://developers.stellar.org/docs/tools/cli/stellar-cli)

---

# Development Patterns

Core and advanced patterns for Stellar smart contracts. For setup and the basic workflow, start at [SKILL.md](#stellar-smart-contracts); for tests see [Testing](#testing); for security review see [Security](#security).

## Execution model

Contracts run as WebAssembly guests in a sandboxed host inside stellar-core. Each transaction gets its own host environment; each contract invoked (directly or nested) runs in its own guest VM inside that host. The host provides storage, crypto, auth, and cross-contract calls; guest code references host objects (`Vec`, `Map`, `Bytes`, `String`, `Address`, …) via integer handles — the host does the actual work and meters every step. Practical consequences:

- `#![no_std]` — use `soroban_sdk` collections and strings; Rust is the supported language
- **A transaction is the atomicity boundary.** Returned errors, panics, missing auth, and budget exhaustion roll back *all* ledger changes, including writes made by nested calls before the failure. A caller can catch a callee's error (via `try_` client methods) and continue.
- **Reentrancy is blocked by the host.** A contract cannot be re-entered directly or indirectly through normal calls. External calls are still failure/budget/side-effect boundaries — order state updates deliberately.
- Contract state lives in storage, never in the `#[contract]` struct — `#[contract] pub struct Foo { x: i128 }` does not persist `x`.
- Everything a contract can reach hangs off `Env`: `storage()`, `events()`, `crypto()`, `ledger()`, `deployer()`, `prng()`, `current_contract_address()`, `invoke_contract()`. There is no I/O, no networking, no clock other than `env.ledger().timestamp()`.
- `env.prng()` is seeded from ledger state and **predictable** — never use it for keys, auth, or high-stakes randomness.

## Storage

Three storage types with different costs and lifetimes. Choosing wrong is a top source of bugs and fee waste:

| Type | Lifetime | Expiry behavior | Use for |
|------|----------|-----------------|---------|
| `instance()` | One TTL shared with the contract instance | Archived with the contract, restorable | Admin address, config, small global state |
| `persistent()` | Per-key TTL | **Archived**, restorable | User balances, anything that must survive |
| `temporary()` | Per-key TTL | **Deleted permanently** | Caches, time-bounded data, oracle prices |

```rust
env.storage().instance().set(&DataKey::Admin, &admin);
env.storage().persistent().set(&DataKey::Balance(user), &balance);
env.storage().temporary().set(&DataKey::Quote(pair), &price);
```

All three support `get`, `set`, `has`, `remove`, `update`, `try_update`, and `extend_ttl`. Instance storage is a single ledger entry shared with the contract instance: cheap to keep all globals warm together (one `extend_ttl` bumps everything), but capped at the network's max entry size (**64KB serialized** on mainnet) — never put per-user or unbounded data there.

### TTL management

Every entry has a TTL counted in ledgers (~5s each, 17,280/day) and is archived (persistent/instance) or deleted (temporary) when it expires. Mainnet floors and ceiling (network-configured): new persistent entries start with ~120 days of TTL, temporary entries ~1 day, and no entry can exceed ~180 days (3,110,400 ledgers).

```rust
const DAY_IN_LEDGERS: u32 = 17280;
const BUMP_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const BUMP_TO: u32 = 120 * DAY_IN_LEDGERS;

// extend_ttl(threshold, extend_to): no-op unless current TTL < threshold,
// then sets TTL to extend_to. Idempotent and floor-only — never shortens.
env.storage().instance().extend_ttl(BUMP_THRESHOLD, BUMP_TO);
env.storage().persistent().extend_ttl(&DataKey::Balance(user), BUMP_THRESHOLD, BUMP_TO);
```

Extending on every write to an entry ("active users pay for their own state") is the standard pattern for per-user data; extending instance TTL at the top of busy entry points keeps globals alive. Rent is charged at invocation time.

Protocol 26 added bounded variants for persistent and instance storage — useful when callers shouldn't be able to force arbitrary rent costs: `extend_ttl_with_limits(&key, extend_to, min_extension, max_extension)`.

Two facts that surprise people:

- **Anyone can extend any entry's TTL** via the `ExtendFootprintTTLOp` transaction operation, no contract auth involved. Benevolent keep-alive services are possible — and TTL expiry is **not a security mechanism**. If data must become invalid after a deadline, store the deadline in the value and check it.
- **Archived is not gone.** Since protocol 23, archived persistent entries declared in a transaction's read-write footprint are restored automatically (you re-pay the storage rent); the CLI and SDKs handle this during simulation. Temporary entries have no such path — expired means deleted.

Contract code should still never assume an entry it wrote is present later: use `get(...).unwrap_or(default)` or `has()` checks in flows where absence is meaningful.

### Typed storage keys

Always use a `#[contracttype]` enum for keys — it centralizes the schema, prevents collisions, and adding variants is the forward-compatible way to grow storage:

```rust
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Balance(Address),
    Allowance(Address, Address), // (owner, spender)
}
```

Keep keys fine-grained (`Balance(Address)` per user, not one giant `Map`). Every transaction declares its read/write footprint upfront; transactions touching the same read-write entry serialize, while fine-grained keys let unrelated transactions run in parallel — and a giant map forces every caller to pay to read all of it.

### Choosing storage — decision tree

1. Must survive indefinitely even if untouched? → `persistent()`
2. Inherently time-bounded, and "expired" may equal "gone"? → `temporary()` (cheapest)
3. Global, small, read on most invocations? → `instance()`
4. Per-user or unbounded in count? → never `instance()`; `persistent()` if durable, `temporary()` if ephemeral

## Data types

```rust
use soroban_sdk::{symbol_short, vec, Address, Bytes, BytesN, Map, String, Symbol, Vec, U256, I256};

let addr: Address = env.current_contract_address();
let sym: Symbol = symbol_short!("transfer");        // ≤9 chars; Symbol max is 32
let s: String = String::from_str(&env, "hello");
let hash: BytesN<32> = env.crypto().sha256(&bytes).into();
let v: Vec<u32> = vec![&env, 1, 2, 3];
let m: Map<Symbol, u32> = Map::new(&env);
```

- `i128` is the canonical token amount type (SEP-41). It admits negatives — validate `amount >= 0` on inputs.
- 256-bit math: `U256`/`I256` with `checked_add/sub/mul/pow/div/rem_euclid/shl/shr` returning `Option` (protocol 26+).
- `MuxedAddress` distinguishes sub-accounts of one address (exchanges, custodians); token `transfer` takes it for the destination. Pass an `&Address` directly — `client.transfer(&from, &to, &amount)` — and let the conversion happen implicitly. Do **not** write `&to.into()`: type inference fails (E0283) because two `From` impls apply.
- `Timepoint` and `Duration` exist for time values; `env.ledger().timestamp()` is a `u64` in seconds.

Custom types derive `#[contracttype]` and work as storage keys/values, arguments, and return values:

```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Position {
    pub collateral: i128,
    pub debt: i128,
    pub last_update: u64,
}
```

Keep type names unique within a contract — all types crossing the ABI are exported flat into the contract spec.

## Authorization

Authorization is host-mediated and explicit. Call `require_auth()` on every address whose consent the operation needs:

```rust
pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
    from.require_auth();
    // or bind the auth to specific arguments instead of all of them:
    // from.require_auth_for_args((&to, amount).into_val(&env));
    // ...
}
```

`require_auth()` asks the host: did `from` authorize *this contract, this function, these exact arguments* in this transaction? `require_auth_for_args` narrows the signed payload to the args you pass — useful for partial commitments (sign a max amount, contract enforces `actual <= max`).

**When to require auth** — for each `Address` parameter, ask whether the call spends, reduces, or reconfigures something that address owns. Reading public data: no auth. Crediting a balance: no auth. Debiting, approving, changing settings, or *consuming the address's authority in a downstream call*: auth required. The right address matters more than the call itself — `who.require_auth()` on a user-supplied `who` proves the caller controls `who`, not that `who` is allowed to do anything (load the admin from storage and auth *that* for privileged paths):

```rust
fn require_admin(env: &Env) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
}
```

### Auth trees and cross-contract propagation

A user signs a **tree of invocations**, not a single call: "I authorize `A.foo(args)`, and within it, `B.bar(args)`". `require_auth` deep in the call stack passes only if the actual call path and arguments match the signed tree, and each tree node matches at most once per transaction. Implications:

- Auth does not cascade. `U` authorizing `A.foo` does not let every contract `A` calls claim `U`'s auth — the client must include inner calls (e.g. `token.transfer`) in the signed tree. SDKs build the tree automatically from simulation.
- Refactoring your call graph (moving a token call from one helper contract to another) changes the tree shape and silently breaks integrations that sign the old shape.
- **Re-auth at every layer that uses an address's authority.** If `deposit(user, amount)` calls `token.transfer(&user, ...)` but never calls `user.require_auth()`, anyone can call `deposit(victim, ...)` and consume a pre-signed inner auth. This is the most common real-world auth bug.

Contracts as callers have one special rule: when contract A directly calls B, B may `require_auth` A's address — the direct call is the authorization. That covers B's immediate invocation only. If B will make a *deeper* call requiring A's auth, A must pre-authorize it:

```rust
// In contract A, before calling B (which will call token.transfer from A's address):
env.authorize_as_current_contract(vec![&env, InvokerContractAuthEntry::Contract(SubContractInvocation {
    context: ContractContext {
        contract: token_id.clone(),
        fn_name: Symbol::new(&env, "transfer"),
        args: (a_address, b_address, amount).into_val(&env),
    },
    sub_invocations: vec![&env],
})]);
b_client.do_thing(...);
```

Replay protection (nonces, expiration) is handled by the host for normal `require_auth` flows — contracts don't track nonces. Stellar accounts satisfy auth at their **medium** threshold.

### Custom accounts (`__check_auth`)

A contract address can act as an account (smart wallet, multisig, passkey wallet) by implementing `CustomAccountInterface`. The host calls `__check_auth` to evaluate the account's policy whenever that contract address is required to authorize something:

```rust
use soroban_sdk::{auth::{Context, CustomAccountInterface}, crypto::Hash};

#[contractimpl]
impl CustomAccountInterface for MyAccount {
    type Signature = BytesN<64>;
    type Error = AccError;

    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,   // host-computed digest of what is being authorized
        signature: BytesN<64>,          // your artifact type — anything #[contracttype]
        auth_contexts: Vec<Context>,    // the calls this auth would cover
    ) -> Result<(), AccError> {
        let pk: BytesN<32> = env.storage().instance().get(&DataKey::Owner).unwrap();
        env.crypto().ed25519_verify(&pk, &signature_payload.into(), &signature);
        // optionally enforce policy from auth_contexts: spend limits, function allowlists…
        Ok(())
    }
}
```

Rules: always verify `signature_payload` (verifying anything else authorizes arbitrary calls); use `auth_contexts` to enforce policies (each `Context::Contract` carries contract, fn_name, args); never `require_auth` the account's own address inside `__check_auth` (it's evaluating auth, not consuming it); keep it lean — its cost is added to every transaction the account signs.

Protocol 27 (CAP-71) adds **auth delegation** for modular accounts: inside `__check_auth`, `env.custom_account().get_delegated_signers()` returns the delegate addresses the transaction supplied (unsanitized — check they are registered delegates of this account), and `env.custom_account().delegate_auth(&addr)` forwards the current authorization check to that G- or C-address. This lets an account delegate authentication to signer contracts without a separate auth entry per delegate; delegation can nest.

Auth semantics reference: [authorization docs](https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization).

## Constructors

`__constructor` runs once, atomically, at deploy time. Prefer it over a separate `initialize` function — it removes the front-running window between deploy and init:

```rust
pub fn __constructor(env: Env, admin: Address, initial_value: u32) {
    env.storage().instance().set(&DataKey::Admin, &admin);
    env.storage().instance().set(&DataKey::Value, &initial_value);
}
```

Rules: exact name `__constructor`; runs only at creation (not on upgrade); failure aborts the deployment atomically; pass args at deploy time after the `--` separator (see [SKILL.md](#build-deploy-invoke)). A contract deployed without a constructor can't retroactively gain one, so plan initialization at deploy time.

If you must support a guarded `initialize` instead (legacy patterns), check-and-set an `Initialized` flag — see [security.md](#3-reinitialization-attacks).

## Cross-contract calls

Import another contract's WASM to get a typed client:

```rust
mod token_contract {
    soroban_sdk::contractimport!(
        file = "../token/target/wasm32v1-none/release/token.wasm"
    );
}

pub fn deposit(env: Env, user: Address, token: Address, amount: i128) {
    user.require_auth();
    let token_client = token_contract::Client::new(&env, &token);
    token_client.transfer(&user, &env.current_contract_address(), &amount);
}
```

For anything implementing the standard token interface (including every Stellar asset via its SAC), the SDK ships a client — no import needed:

```rust
use soroban_sdk::token::TokenClient;

let token = TokenClient::new(&env, &token_address);
token.transfer(&from, &to, &amount);
```

Untyped dynamic calls exist for when the interface isn't known at compile time: `env.invoke_contract::<i128>(&target, &symbol, args)`. Errors from a callee bubble up and abort unless you call through `try_` client methods. There is no `msg.sender` — pass the acting `Address` explicitly and `require_auth` it (see [Authorization](#authorization) for how auth traverses call trees).

## Events

Define events with the `#[contractevent]` macro (the older `env.events().publish(topics, data)` is deprecated):

```rust
use soroban_sdk::contractevent;

// Topics: ("transfer", from, to) — the name (snake-cased) is the first topic by
// default, #[topic] fields follow in order. Non-topic fields form the data payload.
#[contractevent]
pub struct Transfer {
    #[topic]
    pub from: Address,
    #[topic]
    pub to: Address,
    pub amount: i128,
}

// in a contract function:
Transfer { from, to, amount }.publish(&env);
```

Customize with `#[contractevent(topics = ["custom", "prefix"])]` (replaces the name topic) and `data_format = "map" | "vec" | "single-value"` (default `map`; `single-value` for a lone data field, which is what SEP-41 token events use). Topics are how indexers filter — put the event name and participant addresses there, payload in the data.

Emit events for every state change you'll want to index or audit — events are much cheaper than storing queryable state. But they're ephemeral: RPC providers typically retain ~7 days, so anything needed long-term must be derivable from on-chain state. Diagnostic events (`log!`) are off by default on nodes and not part of consensus — never rely on them for logic.

## Error handling

```rust
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized = 1,
    InsufficientBalance = 2,
    InvalidAmount = 3,
}

pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<(), ContractError> {
    if amount <= 0 {
        return Err(ContractError::InvalidAmount);
    }
    // ...
    Ok(())
}
```

- Returning `Result` gives callers typed errors: generated clients expose both `foo()` (panics on error) and `try_foo()` returning `Result<Result<T, _>, Result<E, InvokeError>>`. `Err(Ok(e))` is your typed error. `Err(Err(_))` is an `InvokeError`: a panic or host-level failure (bad auth, type mismatch), or an error code your `E` does not define. `Ok(Err(_))` means the return value failed to convert to `T`. If `foo` does not return `Result`, `E` is `soroban_sdk::Error`, so host failures arrive as `Err(Ok(_))`. Budget exhaustion and footprint violations are not recoverable, so `try_` cannot catch them. In tests: `assert_eq!(client.try_transfer(&from, &to, &0), Err(Ok(ContractError::InvalidAmount)));`
- When panicking, use `panic_with_error!(&env, Error::X)`, not bare `panic!("msg")` — bare panics surface as opaque host errors clients can't match on.
- Error codes are public ABI. Never renumber across upgrades.
- An `Err` return or panic rolls back **all** state changes of the invocation, including nested calls' writes.

## Tokens from the contract side

Token semantics are load-bearing for any contract that moves funds. The interface is SEP-41; every classic Stellar asset also exposes it through its Stellar Asset Contract (SAC), so "token address" may mean a custom contract, a wrapped classic asset, or native XLM.

```rust
use soroban_sdk::token::{TokenClient, StellarAssetClient};

let token = TokenClient::new(&env, &token_addr);          // SEP-41: balance, transfer,
token.transfer(&from, &to, &amount);                      // approve, transfer_from, burn…

let sac = StellarAssetClient::new(&env, &sac_addr);       // SAC admin surface:
sac.mint(&to, &amount);                                   // mint, clawback, set_admin,
                                                          // set_authorized, trust (p26+)
```

What to internalize:

- Amounts are `i128`; reject negatives explicitly. `transfer`'s destination is a `MuxedAddress`, letting exchanges attach sub-account IDs; pass an `&Address` directly (`&to`), never `&to.into()`, which fails to compile (E0283).
- Auth pattern: `transfer`/`approve`/`burn` auth `from`; `transfer_from`/`burn_from` auth the `spender` (the allowance pre-authorized the `from` side). Reads need no auth. `mint`/`clawback`/`set_admin`/`set_authorized`/`trust` are SAC/admin surface, not SEP-41.
- **Allowances expire**: `approve(from, spender, amount, expiration_ledger)`. Convention is temporary storage keyed `(from, spender)` with TTL matching the expiration. Re-approving overwrites — the classic race applies (spender can front-run an allowance reduction and spend old + new); mitigate by approving to 0 first or using exact-amount auth instead of standing allowances.
- **SAC carries classic-asset semantics into contracts**: account (`G...`) balances live in trustlines (missing or unauthorized trustline → transfer fails; 64-bit balance cap), contract (`C...`) balances live in contract storage (full i128). Issuer flags apply — `AUTH_REQUIRED`, freezes via `AUTH_REVOCABLE`, clawback. Transfers to the issuer burn; from the issuer mint. A protocol that accepts arbitrary token addresses must survive all of this — see [Security](#security) for the token-consumer review checklist.
- Emit the standard token event shapes exactly — wallets and indexers depend on them (`soroban-token-sdk` ships these as ready-made `#[contractevent]` structs):

| Event | Topics | Data |
|---|---|---|
| `transfer` | `("transfer", from, to)` | `amount: i128`, or map `{to_muxed_id, amount}` for muxed destinations |
| `approve` | `("approve", from, spender)` | vec `[amount: i128, expiration_ledger: u32]` |
| `mint` | `("mint", to)` | `amount`, or map `{to_muxed_id, amount}` |
| `burn` | `("burn", from)` | `amount` |
| `clawback` | `("clawback", from)` | `amount` |

  The SAC emits these same shapes with one addition: the SEP-0011 asset string (`CODE:ISSUER` or `native`) as a trailing topic.

Custom token implementations, asset issuance, and SAC deployment: `/.well-known/agent-skills/assets/skill.md`. Interface spec: [SEP-41](https://stellar.org/protocol/sep-41), [token interface docs](https://developers.stellar.org/docs/tokens/token-interface).

## Upgradeability

Decide early whether the contract is mutable. If yes, gate the upgrade behind admin/governance auth and track versions:

```rust
use soroban_sdk::ContractExecutable;

contractmeta!(key = "binver", val = "1.0.0");

pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
    env.deployer()
        .update_current_contract(ContractExecutable::Wasm(new_wasm_hash));
}
```

- Upload the new WASM first (`stellar contract upload`), pass its hash here. The contract address and all storage survive; only the executable changes. `__constructor` does not re-run.
- `update_current_contract` takes a `ContractExecutable` since `soroban-sdk` 28 (CAP-85). The older `update_current_contract_wasm(hash)` still works but is deprecated.
- **Storage schema is your problem.** New code reading an old key with a changed `#[contracttype]` shape fails to decode. Patterns: store a schema version and branch on it; add enum variants rather than reshaping existing ones; ship an idempotent, admin-gated `migrate` entrypoint enforcing `new_version > current_version`.
- SEP-0049 standardizes upgradeable-contract interfaces; OpenZeppelin's [stellar-contracts](https://github.com/OpenZeppelin/stellar-contracts) ships audited implementations.

## Factories

```rust
#[contractimpl]
impl Factory {
    pub fn deploy(
        env: Env,
        owner: Address,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
        constructor_args: Vec<Val>,
    ) -> Address {
        owner.require_auth();
        env.deployer()
            .with_address(env.current_contract_address(), salt)
            .deploy_contract(ContractExecutable::Wasm(wasm_hash), constructor_args)
    }
}
```

- `deploy_contract` replaces the deprecated `deploy_v2` since `soroban-sdk` 28.
- Addresses are deterministic per (deployer, salt) — `deployed_address()` computes one without deploying; derive salts intentionally.
- Authorize who may deploy; emit an event per deployment so instances are indexable.
- Keep factory logic separate from instance business logic.

## Governance

For sensitive actions (upgrades, config changes), prefer a timelock: `propose_*` stores the pending action plus an execute-after ledger, `execute_*` enforces the delay, `cancel_*` lets governance abort. For multisig, separate proposer/approver/executor roles, store proposal state in persistent storage, and prevent replay (unique proposal IDs, expiry semantics, explicit events). For signature-set policies, a custom account (`__check_auth`) is often cleaner than in-contract multisig.

## DeFi patterns

Condensed design rules — the details are application-specific:

- **Vaults**: track `total_assets`/`total_shares`, round conservatively on mint/redeem, include pause controls.
- **Pools/AMMs**: define the invariant and fee accounting precisely; slippage-check every user-facing swap.
- **Oracles**: enforce freshness bounds, prefer multi-source/median feeds, add circuit breakers.
- **Regulated tokens**: isolate allowlist/denylist and freeze/forced-transfer logic in dedicated entrypoints with strong auth, emit policy-decision events, never store PII on-chain.

Worked examples: [soroban-examples](https://github.com/stellar/soroban-examples) (liquidity pool, atomic swap, timelock, single-offer).

## Fees and resource limits

Contract transactions pay an inclusion fee (classic surge-priced mechanic) plus a resource fee based on declared consumption: CPU instructions, ledger reads/writes (entries and bytes), transaction size, events size, and rent. Rent/events are refundable if unused; instructions and I/O are charged as declared — so submitters simulate first to size the declaration, and a transaction that exceeds its declaration fails. If actual state diverges from simulation (concurrent writes), costs can shift — leave headroom.

Current mainnet per-transaction ceilings (network-configured, change by validator vote — check the live values on [Stellar Lab's Network Limits page](https://lab.stellar.org/network-limits) or with `stellar network settings --network mainnet`):

| Resource | Limit |
|---|---|
| CPU instructions | 400M |
| Memory | 40 MB |
| Footprint entries (read-only + read-write) | 400 |
| Disk-read entries / written entries | 200 / 200 |
| Disk-read bytes / written bytes | 200 KB / ~129 KB |
| Transaction size | ~129 KB |
| Contract events + return value | 16 KB |
| Contract WASM size | 128 KB |
| Ledger entry size (incl. whole instance storage) | 64 KB (keys 250 B) |

Disk reads count classic entries (accounts, trustlines) in the footprint plus archived contract entries being restored. Live contract data and code are served from memory, so they count toward the 400 footprint entries but not the 200 disk reads.

Optimization rules that actually move the needle:

- Minimize distinct ledger entries touched — each read/write has a fixed cost plus bytes, and everything touched must be in the footprint whether used or not
- Avoid unbounded loops over user-controlled collections (instruction budget + fee-griefing surface; cap or restructure)
- Reduce cross-contract calls in hot paths; each is full invocation overhead
- Use events instead of storage for data that only needs off-chain visibility
- Crypto verifications are the expensive primitive in `__check_auth` — bound signature counts
- Profile before optimizing: `stellar contract invoke ... --send=no` reports instructions, I/O, and fees without submitting

## Contract size

The 128KB limit is real and the release profile in [SKILL.md](#project-setup) is mandatory (`stellar contract build` also optimizes the WASM by default). If you still exceed it:

```bash
ls -la target/wasm32v1-none/release/*.wasm       # check size
cargo install cargo-bloat
cargo bloat --release --target wasm32v1-none     # find heavy deps
```

Then: drop heavy dependencies (full `serde`, `regex` — stay in no_std SDK idioms), split the contract, avoid large static data.

## Troubleshooting

Rows are keyed by the text the CLI or the compiler actually prints — search this table for the string you got, not for a paraphrase of it.

| Symptom | Cause | Fix |
|---------|-------|-----|
| `contract exceeds maximum size` | WASM > 128KB | See [Contract size](#contract-size) |
| `cannot find macro println` / `std` errors | Missing `#![no_std]` | Add as first line of `lib.rs`; use SDK types |
| `can't find crate for core` targeting wasm | Missing target | `rustup target add wasm32v1-none` |
| `reading file target/wasm32v1-none/release/my_contract.wasm: No such file or directory (os error 2)` | The `--wasm` path isn't where the build wrote the artifact — or nothing was built at all | Diagnose both branches: [No wasm at the path you passed](#no-wasm-at-the-path-you-passed) |
| ``linker `link.exe` not found`` plus ``the msvc targets depend on the msvc linker but `link.exe` was not found`` (Windows) | Host-target linking. The wasm itself links with the bundled `rust-lld`, but a contract build still compiles `soroban-sdk`'s proc-macro crate and build script *for the host* — so this hits `stellar contract build` as well as `cargo test` and `cargo install stellar-cli` | Install Visual Studio 2017+ or Build Tools for Visual Studio with the Visual C++ ("Desktop development with C++") workload — VS Code alone is not sufficient. For the CLI itself, take the prebuilt binary instead: `winget install --id Stellar.StellarCLI` |
| `cargo test` fails inside `soroban-env-host` (`ed25519_dalek` trait errors) | A semver-loose transitive dep resolved to an incompatible major (e.g. ed25519-dalek 3.x, mid-2026) | Pin it back: `cargo update ed25519-dalek@3.0.0 --precise 2.2.0` |
| Calls fail after inactivity, data "missing" | Storage TTL expired → archived | Extend TTLs proactively; simulation auto-restores archived persistent entries |
| Temporary data vanished | Wrong storage type | Use `persistent()` for data that must survive |
| `Failed to find config identity for alice` / `invalid signing key or identity name` | CLI identity missing or misspelled | `stellar keys ls` to see what's saved; `stellar keys generate alice --network testnet --fund` to create it |
| `An identity with the name 'alice' already exists` | `stellar keys generate` / `keys add` refuse to clobber a saved identity | Reuse it (`stellar keys public-key alice`) or pick another name. `--overwrite` replaces the stored secret with no way back — never on a key that holds funds |
| `alias 'x' is already referencing contract 'C…' on network '…'` | `stellar contract alias add` won't rebind an alias that points somewhere else | Pass `--overwrite`, or pick another alias — note `stellar contract deploy --alias` always overwrites without asking |
| `Unable to fund account alice on …`, **and the command still exits 0** | Friendbot request failed. The key *was* saved; the account was never created, so the next command fails on a nonexistent account | Retry against the network the error names — `stellar keys fund alice --network testnet` — which exits non-zero and prints the real cause (`funding failed: …`). Friendbot only exists on testnet/futurenet/local — on mainnet, fund from an already-funded account |
| `invalid argument format` on invoke | Wrong CLI arg syntax | Plain strings for addresses; JSON for complex types |
| `transaction simulation failed` | Contract tx not simulated/assembled | Simulate, then `assembleTransaction` before signing |
| Auth fails only in cross-contract flows | Signed auth tree doesn't match actual call path | Rebuild the tree from simulation; re-auth at each layer (see [Authorization](#authorization)) |
| `tx_bad_auth` | Wrong network passphrase or signer | Match passphrase to network; check signing identity |
| `tx_bad_seq` | Stale sequence number | Reload the account before building the tx |

### No wasm at the path you passed

`stellar contract build` reports the artifact it wrote as `Wasm File:` under `Build Summary:`. That path — not a reconstructed one — is what `--wasm` takes. When it doesn't exist, decide which of two things happened:

- **A wasm was built, somewhere else.** In a Cargo workspace artifacts land in the *workspace-root* `target/` by default, not in the package's own directory, and the filename is the package name with `-` replaced by `_` (package `my-contract` → `my_contract.wasm`). `CARGO_TARGET_DIR` or `build.target-dir` moves that root elsewhere, which is why the printed `Wasm File:` path is the one to trust. Deploying from inside `contracts/my-contract/` with a relative `target/...` path is the usual version of this.
- **No wasm was built at all, and the build still exited 0.** Run from the workspace root, the build compiles only workspace *default members* whose `[lib]` declares `crate-type = [..., "cdylib"]` — every other package is skipped silently. Add the `cdylib` crate type (see [SKILL.md](#project-setup)) and check the package is a *default* member: if the root `Cargo.toml` sets `workspace.default-members`, a package listed only in `workspace.members` is skipped. `stellar contract build --package my-contract` (or running from that package's own directory) selects by name instead, and fails loudly — `package my-contract not found` — rather than quietly building nothing.

Inside a workspace you can skip the path entirely: `stellar contract deploy` with neither `--wasm` nor `--wasm-hash` builds the project and uses its own output.

Client-side issues (wallet detection, trustlines, transaction building from JS) are covered in `/.well-known/agent-skills/dapp/skill.md` and `/.well-known/agent-skills/data/skill.md`.

---

# Testing

Testing strategy for Stellar smart contracts, from fast native unit tests to mainnet-fork tests. Companion to [SKILL.md](#stellar-smart-contracts), [Development Patterns](#development-patterns), and [Security](#security).

Layers, fastest first:

1. **Unit tests** — native Rust with `soroban-sdk` testutils (not WASM, full debugger support)
2. **Local integration** — Stellar Quickstart container
3. **Testnet** — public network rehearsal
4. **Fork tests** — replay against real ledger state

## Unit testing

```rust
// src/test.rs — a separate file included from lib.rs with `mod test;`
// (the layout `stellar contract init` scaffolds). The inner `#![cfg(test)]`
// gates this whole module; don't paste it into lib.rs itself.
#![cfg(test)]
extern crate std;  // contracts are no_std; tests can still use std explicitly
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal,
};
use crate::{Contract, ContractClient};

#[test]
fn test_basic() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());      // () = no constructor args
    let client = ContractClient::new(&env, &contract_id);
    let user = Address::generate(&env);

    client.set_owner(&user);
    assert_eq!(client.get_value(), 0);
}
```

`env.register` takes constructor args as its second parameter — `env.register(Contract, (admin.clone(),))` for a contract with `__constructor(env, admin)`. Use `env.register_at(&address, Contract, args)` to pin a specific address.

**Resource limits are enforced in tests** (SDK 25+): `Env::default()` applies mainnet CPU/memory limits to invocations, so a contract that would blow the budget in production fails in unit tests — that's a feature. For deliberately heavy tests: `env.cost_estimate().disable_resource_limits()`; to read consumption, `env.cost_estimate().resources()`.

### Authorization

`mock_all_auths()` approves everything — convenient, but it can hide missing `require_auth` calls. Always pair it with `env.auths()` assertions, or mock specific auths:

```rust
#[test]
fn test_auth() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    let user = Address::generate(&env);
    let other = Address::generate(&env);
    // Approve only this specific invocation
    env.mock_auths(&[MockAuth {
        address: &user,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "transfer",
            args: (&user, &other, &100i128).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.transfer(&user, &other, &100);
    assert!(!env.auths().is_empty());  // verify auth was actually required
}
```

`env.auths()` returns `(Address, AuthorizedInvocation)` pairs **for the most recent invocation only** — any later client call (even a read) resets it, so assert immediately after the call under test. Assert the exact tree (function, args, sub-invocations) on security-critical paths so a dropped `require_auth` fails the test. If a contract authorizes calls below the entry point (e.g. via `authorize_as_current_contract`), use `mock_all_auths_allowing_non_root_auth()`.

### Time and ledger state

```rust
env.ledger().set_timestamp(1000);          // for vesting/timelock logic
env.ledger().set_sequence_number(1000);
// ... act, then advance:
env.ledger().set_timestamp(2500);
```

### Events

Events defined with `#[contractevent]` compare directly against emitted XDR:

```rust
use soroban_sdk::{testutils::Events as _, Event as _};

let expected = Transfer { from: from.clone(), to: to.clone(), amount: 100 };
assert_eq!(
    env.events().all(),
    std::vec![expected.to_xdr(&env, &contract_id)],
);
```

`env.events().all()` returns the events of the **most recent invocation** as `ContractEvents` (like `env.auths()`, it resets on every call — assert right after the call under test); `event.to_xdr(&env, &contract_id)` builds the expected `xdr::ContractEvent` from the struct.

### Storage TTL

```rust
use soroban_sdk::testutils::storage::Persistent as _;  // get_ttl lives on testutils traits

let ttl: u32 = env.as_contract(&contract_id, || {
    env.storage().persistent().get_ttl(&DataKey::MyData)
});
assert!(ttl > 0);
```

### Cross-contract

Register a real dependency from its WASM and test the interaction:

```rust
mod token { soroban_sdk::contractimport!(file = "token.wasm"); }

let token_id = env.register(token::WASM, ());
let vault_id = env.register(VaultContract, ());
// drive both through their typed clients
```

## Local network

```bash
stellar container start local     # or: docker run --rm -it -p 8000:8000 stellar/quickstart:latest --local
stellar keys generate test-account --network local --fund
stellar contract deploy --wasm target/wasm32v1-none/release/contract.wasm \
  --source-account test-account --network local
```

Endpoints: RPC `http://localhost:8000/soroban/rpc`, Horizon `http://localhost:8000`, passphrase `"Standalone Network ; February 2017"`.

## Testnet

```bash
stellar keys generate my-key --network testnet --fund
stellar contract deploy --wasm ... --source-account my-key --network testnet
```

- RPC: `https://soroban-testnet.stellar.org` · Horizon: `https://horizon-testnet.stellar.org`
- Passphrase: `"Test SDF Network ; September 2015"` · Friendbot: `https://friendbot.stellar.org`
- **Testnet resets quarterly** — everything is deleted. Script your deployments; never treat testnet state as durable.
- Testnet runs the next protocol version before mainnet — it's where you verify against an upcoming upgrade.

## Integration tests

TypeScript, against local or testnet (the same flow a frontend uses — simulate, assemble, sign, send):

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

const rpc = new StellarSdk.rpc.Server(process.env.RPC_URL!);
const account = await rpc.getAccount(keypair.publicKey());
const contract = new StellarSdk.Contract(contractId);

const tx = new StellarSdk.TransactionBuilder(account, { fee: "100", networkPassphrase })
  .addOperation(contract.call("initialize", StellarSdk.Address.fromString(keypair.publicKey()).toScVal()))
  .setTimeout(30)
  .build();

const sim = await rpc.simulateTransaction(tx);
const prepared = StellarSdk.rpc.assembleTransaction(tx, sim).build();
prepared.sign(keypair);
const sent = await rpc.sendTransaction(prepared);
// Only PENDING and DUPLICATE mean the transaction is queued; fail the test otherwise.
if (sent.status !== "PENDING" && sent.status !== "DUPLICATE") {
  throw new Error(`sendTransaction returned ${sent.status}`, { cause: sent.errorResult });
}
const result = await rpc.pollTransaction(sent.hash);
if (result.status !== "SUCCESS") throw new Error(`transaction ${result.status}`);
```

In Rust, gate network-dependent tests behind `#[ignore]` and run them with `cargo test -- --ignored` in environments where the network is up.

## Fuzz testing

All `#[contracttype]` types implement `SorobanArbitrary` under the `testutils` feature, so fuzzing works out of the box with `cargo-fuzz`:

```bash
rustup install nightly
cargo install --locked cargo-fuzz
cargo fuzz init
```

The default scaffold's `crate-type = ["lib", "cdylib"]` already exposes the lib target fuzzing needs; add `soroban-sdk = { version = "...", features = ["testutils"] }` to `fuzz/Cargo.toml`.

```rust
// fuzz/fuzz_targets/fuzz_deposit.rs
#![no_main]
use libfuzzer_sys::fuzz_target;
use soroban_sdk::{testutils::Address as _, Address, Env};
use my_contract::{Contract, ContractClient};

fuzz_target!(|amount: i128| {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    let user = Address::generate(&env);

    let _ = client.try_deposit(&user, &amount);  // must never panic unexpectedly
});
```

Run with `cargo +nightly fuzz run fuzz_deposit`. For token contracts there's a reusable harness: [soroban-token-fuzzer](https://github.com/brson/soroban-token-fuzzer). Docs: [fuzzing guide](https://developers.stellar.org/docs/build/guides/testing/fuzzing).

## Property-based testing

`proptest` + `SorobanArbitrary` runs in plain `cargo test` — use it to lock in invariants found by fuzzing:

```rust
proptest! {
    #[test]
    fn deposit_then_withdraw_preserves_balance(amount in 1i128..=i128::MAX) {
        // setup as usual...
        client.deposit(&user, &amount);
        client.withdraw(&user, &amount);
        prop_assert_eq!(client.balance(&user), 0);
    }
}
```

Workflow: fuzz interactively to find deep bugs → convert findings to proptest regressions for CI.

## Snapshots, fork tests, mutation tests

Three techniques worth knowing; each is one command plus a doc link:

- **Test snapshots**: every test writes a JSON snapshot of events + final ledger state to `test_snapshots/`. Commit them — diffs expose unintended behavioral changes. (Disable per-env with `Env::new_with_config` if they're noise.) [Docs](https://developers.stellar.org/docs/build/guides/testing/differential-tests-with-test-snapshots)
- **Fork testing**: `stellar snapshot create --address C... --output json --out snapshot.json`, then `Env::from_ledger_snapshot_file("snapshot.json")` to test against real network state. Also useful for upgrade rehearsals: `stellar contract fetch --id C... --out-file deployed.wasm`, register both old and new versions, compare behavior. [Docs](https://developers.stellar.org/docs/build/guides/testing/fork-testing)
- **Mutation testing**: `cargo install --locked cargo-mutants && cargo mutants` — mutates your source and reports `MISSED` where tests didn't notice. [Docs](https://developers.stellar.org/docs/build/guides/testing/mutation-testing)

## Resource profiling

```bash
stellar contract invoke --id CONTRACT_ID --source-account alice --network testnet \
  --send=no -- function_name --arg value
```

Simulation reports CPU instructions, ledger reads/writes, and fees without submitting. In unit tests, `env.cost_estimate().resources()` gives the same numbers programmatically.

## CI

```yaml
name: Test contracts
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: rustup target add wasm32v1-none
      - uses: stellar/stellar-cli@v28.1.0   # the tag picks the CLI version
      - run: cargo test
      - run: stellar contract build
```

From `soroban-sdk` 28, `cargo build --target wasm32v1-none` stops with an error. Build Wasm with `stellar contract build` (stellar-cli v25.2.0+).

For integration jobs, run `stellar/quickstart` as a service container and deploy with the CLI (`cargo install stellar-cli --locked`).

## Checklist

- [ ] Unit tests cover all public functions, including error paths (`try_` methods)
- [ ] Edge cases: zero amounts, max values, empty state
- [ ] Authorization verified with `env.auths()` or specific `mock_auths`
- [ ] Events asserted (`event.to_xdr` comparison)
- [ ] Storage TTL behavior validated
- [ ] Cross-contract interactions tested against real WASM
- [ ] Fuzz targets for value-moving paths (deposit, withdraw, swap)
- [ ] Property tests for invariants
- [ ] Test snapshots committed
- [ ] Integration test against local network in CI
- [ ] Testnet rehearsal before mainnet

---

# Security

Security review guide for Stellar smart contracts. Companion to [SKILL.md](#stellar-smart-contracts), [Development Patterns](#development-patterns), and [Testing](#testing).

## Threat model

Assume the attacker controls:

- All arguments passed to contract functions
- Transaction ordering and timing
- All accounts except those requiring signatures
- The ability to deploy contracts that mimic your interface
- The shape of on-chain state they can legally create (entry counts, TTLs — they can even extend your entries' TTLs)

## What the platform rules out

- **No `delegatecall`** — contracts cannot execute foreign bytecode in their own context; proxy-style hijacks don't exist.
- **No reentrancy** — the host blocks reentrant calls, direct or indirect, on normal cross-contract paths. External calls remain failure/budget/side-effect boundaries — still order state updates deliberately.
- **Host-managed auth replay protection** — nonces and expirations on authorization entries are enforced by the host, not by your code.
- **Explicit authorization** — `require_auth()` is opt-in, which means *forgetting it* is the failure mode to hunt for.

## Vulnerability classes

### 1. Missing authorization

```rust
// BAD: anyone can drain
pub fn withdraw(env: Env, to: Address, amount: i128) {
    transfer_tokens(&env, &to, amount);
}

// GOOD
pub fn withdraw(env: Env, to: Address, amount: i128) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
    transfer_tokens(&env, &to, amount);
}
```

Every privileged path needs `require_auth()` on the right address — and "right" means the address with policy authority, loaded from storage, not a caller-supplied parameter (`who.require_auth()` on an arbitrary `who` proves nothing). Auth variants: [development.md](#authorization).

### 2. Auth replay through middleware (missing outer `require_auth`)

The cross-contract variant of #1, and the most common real-world auth bug:

```rust
// BAD: never auths `user` here
pub fn settle(env: Env, user: Address, amount: i128) {
    token_client.transfer(&user, &recipient, &amount);
}
```

If `user` has pre-signed an auth tree that includes the inner `token.transfer`, *anyone* can call `settle(user, ...)` and consume it. Re-authorize at **every** layer that exercises an address's authority, not just the deepest call. Review rule: for each entry point, enumerate every `Address` argument and ask whose authority each state change consumes. Auth-tree semantics: [development.md](#auth-trees-and-cross-contract-propagation).

### 3. Reinitialization attacks

Only relevant if you use a guarded `initialize` instead of a `__constructor` (which can't re-run):

```rust
// GOOD: refuses second call
pub fn initialize(env: Env, admin: Address) {
    if env.storage().instance().has(&DataKey::Admin) {
        panic_with_error!(&env, Error::AlreadyInitialized);
    }
    env.storage().instance().set(&DataKey::Admin, &admin);
}
```

Without the guard, anyone can call `initialize` first (or again) and capture admin.

### 4. Arbitrary contract calls

Calling whatever address a user passes lets an attacker substitute a contract that mimics the interface:

```rust
// GOOD: allowlist external contracts
pub fn swap(env: Env, token: Address, amount: i128) {
    let allowed: Vec<Address> = env.storage().instance().get(&DataKey::AllowedTokens).unwrap();
    if !allowed.contains(&token) {
        panic_with_error!(&env, Error::TokenNotAllowed);
    }
    let client = TokenClient::new(&env, &token);
    // ...
}
```

A user-supplied contract address is arbitrary code: it can fail, trap, burn budget, emit misleading events, or call other contracts (it just can't re-enter you).

### 5. Integer overflow/underflow

`overflow-checks = true` in the release profile catches overflows at runtime (panic), but explicit checked math fails cleaner and survives profile mistakes:

```rust
let new_balance = balance.checked_add(amount).expect("overflow");
```

Also validate sign and range on inputs — `i128` amounts can be negative, and `transfer(from, to, -1000)` is a withdrawal from `to` if unchecked. For 256-bit types, use the `checked_*` methods (protocol 26+).

### 6. Storage key collisions

Untyped keys can silently overwrite unrelated data. Always use a `#[contracttype]` key enum — see [development.md](#typed-storage-keys).

### 7. Check-then-act races

State can change between transactions. Do checks and state changes atomically within one invocation, and take slippage bounds (`min_out`) from the caller:

```rust
pub fn swap(env: Env, user: Address, amount_in: i128, min_out: i128) {
    user.require_auth();
    let amount_out = calculate_output(amount_in);
    if amount_out < min_out {
        panic_with_error!(&env, Error::SlippageExceeded);
    }
    // update all state in this same invocation
}
```

The token-allowance variant: `approve` overwrites, so reducing a non-zero allowance can be front-run (spend old, then spend new). Approve to 0 first, or use exact-amount auth instead of standing allowances.

### 8. TTL and archival failures

Two distinct failure modes:

- **Critical state expires**: a temporary entry silently disappears (permanently), or persistent entries archive and add restoration friction. Extend TTLs in hot paths; monitor entry TTLs in production — see [development.md](#ttl-management).
- **TTL used as a security mechanism**: anyone can extend any entry's TTL via `ExtendFootprintTTLOp`, so "this entry expires, therefore the permission ends" is broken by design. Store an explicit deadline in the value and check it.

### 9. Trusting cross-contract return values

Validate data from external contracts — allowlist oracles, sanity-check magnitudes, enforce freshness:

```rust
let price: i128 = oracle_client.get_price(&asset);
if price <= 0 || price > MAX_REASONABLE_PRICE {
    panic_with_error!(&env, Error::InvalidPrice);
}
```

### 10. Resource exhaustion / fee griefing

A function whose worst-case cost on attacker-shaped input exceeds network limits is a denial of service on legitimate users. Hunt for: loops bounded by user-controlled collections or entry counts, per-iteration storage reads or events, unbounded signature counts in `__check_auth`. Cap iteration counts explicitly and keep footprints small — limits and costs: [development.md](#fees-and-resource-limits).

### 11. Custom account (`__check_auth`) pitfalls

- Verify `signature_payload` itself — verifying any other message authorizes arbitrary calls.
- Enforce policies from `auth_contexts` (spend limits, function allowlists); ignoring it makes "policy" wallets decorative.
- CAP-71 delegation: `get_delegated_signers()` returns **unsanitized** user input — verify each address is actually a registered delegate before calling `delegate_auth`.
- Details: [development.md](#custom-accounts-__check_auth).

## Token-consumer review (AMMs, vaults, escrows, lenders)

Any contract that takes a token address must assume it may be native XLM's SAC, a wrapped classic asset's SAC, or a custom contract:

- [ ] Which tokens are accepted — allowlisted or permissionless? (Permissionless ⇒ class #4 applies)
- [ ] Decimals handled? Query and store at registration; never assume 7.
- [ ] Received amount re-checked after `transfer` where it matters? (Fee-on-transfer or non-standard tokens deliver less than requested)
- [ ] SAC/classic quirks survivable — recipient missing a trustline, `AUTH_REQUIRED` assets, frozen accounts, issuer clawback? (Semantics: [development.md](#tokens-from-the-contract-side))
- [ ] `transfer_from` flows: does UX coordinate the allowance, and does the code auth the `spender` (not `from`)?
- [ ] Standard token event shapes emitted, so indexers/wallets see the flows?

## Checklists

### Contract

- [ ] All privileged functions require appropriate authorization, loaded from storage
- [ ] Every layer using an address's authority re-auths it (no middleware replay)
- [ ] Initialization can only happen once (or uses `__constructor`)
- [ ] External contract calls validated/allowlisted; return values sanity-checked
- [ ] Arithmetic checked; input signs and ranges validated
- [ ] Storage keys typed and collision-free
- [ ] Critical TTLs extended proactively; no TTL-as-security assumptions
- [ ] Loops and footprints bounded on attacker-shaped input
- [ ] Events emitted for auditable state changes (and error codes never renumbered)
- [ ] Upgrade path gated, tested (happy + failure), and replay-safe
- [ ] Emergency controls (pause) and incident runbook defined for value-bearing contracts
- [ ] Deployed WASM traceable to its source — SEP-55 build metadata plus a GitHub attestation from a public repo, deployed from the release artifact ([SKILL.md](#verify-your-build))

### Client-side

- [ ] Network passphrase validated before signing
- [ ] Transactions simulated before submission
- [ ] Operation details displayed clearly; confirmation for high-value actions
- [ ] Contract addresses verified against known deployments
- [ ] Trustline status checked before transfers

## Tooling

**Static analysis**

- [Scout](https://github.com/CoinFabrik/scout-soroban) (CoinFabrik): `cargo install cargo-scout-audit && cargo scout-audit` — 20+ detectors (missing overflow checks, unprotected WASM update, unrestricted transfers, unsafe unwrap, DoS-unbounded ops). SARIF output for CI; VSCode extension available.
- [Security Detectors SDK](https://github.com/OpenZeppelin/soroban-security-detectors-sdk) (OpenZeppelin): pre-built detectors (`auth_missing`, `unchecked_ft_transfer`, improper TTL extension) plus a framework for writing custom ones.

**Formal verification**

- [Certora Sunbeam](https://docs.certora.com/en/latest/docs/sunbeam/index.html): specs as Rust macros (`cvlr_assert!`), operates on WASM bytecode.
- [Komet](https://docs.runtimeverification.com/komet) (Runtime Verification): property tests + formal verification via KWasm semantics.

**Monitoring**: [OpenZeppelin Monitor](https://www.openzeppelin.com/news/monitor-and-relayers-are-now-open-source) — self-hosted contract monitoring with Stellar support.

**Knowledge base**: [sorobansecurity.com](https://sorobansecurity.com) — searchable audit reports and vulnerability database.

## Audits and bounties

- **[Audit Bank](https://stellar.org/grants-and-funding/soroban-audit-bank)** — SDF-subsidized audits for SCF-funded protocols ($3M+ across 43+ audits to date). Partner firms include OtterSec, Veridise, Runtime Verification, CoinFabrik, Certora, Zellic, Code4rena. Follow-up audits trigger at TVL milestones.
- **[Immunefi — Stellar](https://immunefi.com/bug-bounty/stellar/)** — up to $250K for core/SDK/CLI vulnerabilities (PoC required, local forks only).
- **[Immunefi — OpenZeppelin on Stellar](https://immunefi.com/bug-bounty/openzeppelin-stellar/)** — up to $25K for the audited contracts library.

Before requesting an audit: run the static analyzers, complete the checklists above, document your threat model and trust assumptions, and have the test suite from [Testing](#testing) green — auditors' time is better spent on logic than on lint.
