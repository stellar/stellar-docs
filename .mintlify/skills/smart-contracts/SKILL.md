---
name: smart-contracts
description: Stellar smart contract development (Rust, soroban-sdk). Entry point with project setup, contract anatomy, and build/deploy workflow, routing to three companion files in this directory — development.md (storage, auth, cross-contract calls, events, errors, upgrades, factories, troubleshooting), testing.md (unit, fuzz, property, fork, mutation, integration), and security.md (vulnerability classes, checklists, tooling, audits). Use when writing, testing, securing, or shipping Stellar smart contracts (formerly branded Soroban).
user-invocable: true
argument-hint: "[contract task]"
---

# Stellar Smart Contracts

Guide for building Stellar smart contracts in Rust. Smart contracts on Stellar were formerly branded "Soroban" — the platform name is retired, but the Rust SDK (`soroban-sdk`) and several tool names keep the prefix.

This file covers setup and the core workflow. The deep dives are included below — **jump to the section that matches the task**:

| Task | Section |
|------|------|
| Storage, auth, cross-contract calls, events, errors, upgrades, factories, troubleshooting | [Development Patterns](#development-patterns) |
| Unit, integration, fuzz, property, fork, and mutation testing | [Testing](#testing) |
| Security review, vulnerability classes, checklists, audit prep, tooling | [Security](#security) |

## When to use this skill
- Writing a Stellar smart contract in Rust
- Setting up contract tests (any layer)
- Reviewing a contract for security issues
- Architecting upgradeable contracts, factories, governance, or DeFi primitives
- Debugging a contract-specific error (auth, storage, archival, resource limits)

## Related skills
- Assets, trustlines, and SAC bridge → `/.well-known/agent-skills/assets/skill.md`
- Frontend/wallets that call your contract → `/.well-known/agent-skills/dapp/skill.md`
- Chain data queries (RPC/Horizon) → `/.well-known/agent-skills/data/skill.md`
- ZK verification (BLS12-381, Groth16, Circom/Noir/RISC Zero) → `/.well-known/agent-skills/zk-proofs/skill.md`
- SEP/CAP standards and ecosystem links → `/.well-known/agent-skills/standards/skill.md`

## Platform constraints

Contracts are Rust compiled to WebAssembly, run in a sandboxed host:

- `#![no_std]` required — use `soroban_sdk` types (`String`, `Vec`, `Map`, `Symbol`), not the Rust standard library
- 64KB compiled contract size limit — use the release profile below
- `Symbol` is limited to 32 characters; `symbol_short!()` covers up to 9
- Storage is rented: every entry has a TTL and can be archived — see [development.md](#storage)
- No `delegatecall`, no classical cross-contract reentrancy — see [security.md](#security)

## Project setup

```bash
stellar contract init my-contract   # scaffolds a Cargo workspace with contracts/
cd my-contract
```

`Cargo.toml` essentials:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = "25.0.1"  # check https://crates.io/crates/soroban-sdk for latest

[dev-dependencies]
soroban-sdk = { version = "25.0.1", features = ["testutils"] }  # match above

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

One compact example showing state, constructor, auth, TTL, and a typed error:

```rust
#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env};

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

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    // Runs once, atomically, at deploy time (Protocol 22+). Must be named
    // `__constructor` and return (). Does not run again on upgrade.
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
        env.storage().instance().extend_ttl(100, 518400);

        Ok(count)
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
    }
}
```

Full patterns (three storage types, auth variants, cross-contract calls, events, custom types): [development.md](#development-patterns).

## Build, deploy, invoke

```bash
# Build optimized WASM → target/wasm32-unknown-unknown/release/*.wasm
stellar contract build

# Create and fund an identity (testnet)
stellar keys generate --global alice --network testnet --fund

# Deploy (constructor args go after the `--`)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/my_contract.wasm \
  --source alice \
  --network testnet \
  -- \
  --admin alice

# Invoke
stellar contract invoke \
  --id CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  increment
```

To upload WASM without instantiating (e.g. for factories or upgrades), use `stellar contract upload` (the older `stellar contract install` is a deprecated alias).

## Minimal test

```rust
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

Auth mocking, fuzzing, fork tests, and CI setup: [testing.md](#testing).

## Before mainnet

Work through the checklists in [security.md](#security) — authorization, reinitialization, arithmetic, storage TTLs, and cross-contract validation are the recurring failure modes.

## Documentation

- [Smart contract docs](https://developers.stellar.org/docs/build/smart-contracts)
- [Example contracts](https://github.com/stellar/soroban-examples)
- [soroban-sdk API reference](https://docs.rs/soroban-sdk)
- [Stellar CLI manual](https://developers.stellar.org/docs/tools/cli/stellar-cli)


---

# Development Patterns

Core and advanced patterns for Stellar smart contracts. For setup and the basic workflow, start at [SKILL.md](#stellar-smart-contracts); for tests see [testing.md](#testing); for security review see [security.md](#security).

## Architecture

Contracts run as WebAssembly guests in a sandboxed host. The host provides storage, crypto, and cross-contract calls; guest code references host objects via handles, not direct memory. Practical consequences:

- `#![no_std]` — use `soroban_sdk` collections and strings
- 64KB compiled size limit (see [Contract size](#contract-size) below)
- Rust is the supported language. Community alternatives (AssemblyScript, Solidity via Solang) exist but are not production-ready — see [migration docs](https://developers.stellar.org/docs/learn/migrate).

## Storage

Three storage types with different costs and lifetimes. Choosing wrong is a top source of bugs and fee waste:

| Type | Lifetime | Use for |
|------|----------|---------|
| `instance()` | Tied to the contract instance, shared TTL | Admin address, global config, small global state |
| `persistent()` | Per-key TTL, archived when expired but **restorable** | User balances, anything that must survive |
| `temporary()` | Per-key TTL, deleted when expired, **not restorable** | Caches, session data, short-lived flags |

```rust
env.storage().instance().set(&DataKey::Admin, &admin);
env.storage().persistent().set(&DataKey::Balance(user), &balance);
env.storage().temporary().set(&DataKey::Cache(key), &value);
```

### TTL management

Every entry has a TTL (in ledgers, ~5s each) and is archived when it expires. Extend proactively in functions that touch the data:

```rust
const MIN_TTL: u32 = 17280;     // ~1 day
const EXTEND_TO: u32 = 518400;  // ~30 days

// extend_ttl(threshold, extend_to): only extends if TTL < threshold
env.storage().instance().extend_ttl(MIN_TTL, EXTEND_TO);
env.storage().persistent().extend_ttl(&DataKey::Balance(user), MIN_TTL, EXTEND_TO);
```

Archived persistent entries can be restored with a `RestoreFootprint` operation, but that costs an extra transaction — design TTL extension into hot paths instead. Details: [state archival docs](https://developers.stellar.org/docs/learn/fundamentals/contract-development/storage/state-archival).

### Typed storage keys

Always use a `#[contracttype]` enum for keys — ad-hoc symbols invite collisions:

```rust
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Balance(Address),
    Allowance(Address, Address), // (owner, spender)
}
```

## Data types

```rust
use soroban_sdk::{Address, Bytes, BytesN, Map, String, Symbol, Vec};

let addr: Address = env.current_contract_address();
let sym: Symbol = symbol_short!("transfer");        // ≤9 chars; Symbol max is 32
let s: String = String::from_str(&env, "hello");
let hash: BytesN<32> = env.crypto().sha256(&bytes).into();
let v: Vec<u32> = vec![&env, 1, 2, 3];
let m: Map<Symbol, u32> = Map::new(&env);
```

Custom types derive `#[contracttype]`:

```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: Symbol,
    pub decimals: u32,
}
```

## Authorization

Authorization is opt-in and explicit. Call `require_auth()` on every address whose consent the operation needs:

```rust
pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
    from.require_auth();
    // or bind the auth to specific arguments:
    // from.require_auth_for_args((&to, amount).into_val(&env));
    // ...
}
```

Admin pattern:

```rust
fn require_admin(env: &Env) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
}
```

Authorization semantics (sub-invocations, custom accounts): [auth docs](https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization).

## Constructors

`__constructor` runs once, atomically, at deploy time (Protocol 22+). Prefer it over a separate `initialize` function — it removes the front-running window between deploy and init:

```rust
pub fn __constructor(env: Env, admin: Address, initial_value: u32) {
    env.storage().instance().set(&DataKey::Admin, &admin);
    env.storage().instance().set(&DataKey::Value, &initial_value);
}
```

Rules: exact name `__constructor`, returns `()`, runs only at creation (not on upgrade), failure aborts the deployment atomically. Pass args at deploy time after the `--` separator (see [SKILL.md](#build-deploy-invoke)).

If you must support a guarded `initialize` instead (pre-Protocol-22 targets), check-and-set an `Initialized` flag — see [security.md](#2-reinitialization-attacks).

## Cross-contract calls

Import another contract's WASM to get a typed client:

```rust
mod token_contract {
    soroban_sdk::contractimport!(
        file = "../token/target/wasm32-unknown-unknown/release/token.wasm"
    );
}

pub fn deposit(env: Env, user: Address, token: Address, amount: i128) {
    user.require_auth();
    let token_client = token_contract::Client::new(&env, &token);
    token_client.transfer(&user, &env.current_contract_address(), &amount);
}
```

For Stellar assets, use the built-in SAC client — every asset has a Stellar Asset Contract:

```rust
use soroban_sdk::token::Client as TokenClient;

let token = TokenClient::new(&env, &asset_contract_id);
token.transfer(&from, &to, &amount);
```

SAC details and asset interop: `/.well-known/agent-skills/assets/skill.md`. Validate addresses you call — see [security.md](#3-arbitrary-contract-calls).

## Events

```rust
use soroban_sdk::contractevent;

#[contractevent(topics = ["transfer"])]
pub struct TransferEvent {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

// in a contract function:
TransferEvent { from, to, amount }.publish(&env);
```

Emit events for every state change you'll want to index or audit — events are much cheaper than storing queryable state.

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

Returning `Result` gives callers (and clients generated for tests) typed errors via `try_` methods. Panics abort with less information — reserve them for invariant violations.

## Upgradeability

Decide early whether the contract is mutable. If yes, gate the upgrade behind admin/governance auth and track versions:

```rust
contractmeta!(key = "binver", val = "1.0.0");

pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
    env.deployer().update_current_contract_wasm(new_wasm_hash);
}
```

- Upload the new WASM first (`stellar contract upload`), pass its hash here.
- Add a dedicated `migrate` entrypoint for storage migrations; make it idempotent and monotonic (`new_version > current_version`).
- `__constructor` does not re-run on upgrade.
- SEP-0049 standardizes upgradeable-contract interfaces; OpenZeppelin's [stellar-contracts](https://github.com/OpenZeppelin/stellar-contracts) ships an audited implementation.

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
            .deploy_v2(wasm_hash, constructor_args)
    }
}
```

- Addresses are deterministic per (deployer, salt) — derive salts intentionally.
- Authorize who may deploy; emit an event per deployment so instances are indexable.
- Keep factory logic separate from instance business logic.

## Governance

For sensitive actions (upgrades, config changes), prefer a timelock: `propose_*` stores the pending action plus an execute-after ledger, `execute_*` enforces the delay, `cancel_*` lets governance abort. For multisig, separate proposer/approver/executor roles, store proposal state in persistent storage, and prevent replay (unique proposal IDs, expiry semantics, explicit events).

## DeFi and compliance patterns

Condensed design rules — the details are application-specific:

- **Vaults**: track `total_assets`/`total_shares`, round conservatively on mint/redeem, include pause controls.
- **Pools/AMMs**: define the invariant and fee accounting precisely; slippage-check every user-facing swap.
- **Oracles**: enforce freshness bounds, prefer multi-source/median feeds, add circuit breakers.
- **Regulated tokens**: isolate allowlist/denylist and freeze/forced-transfer logic in dedicated entrypoints with strong auth, emit policy-decision events, never store PII on-chain.

Worked examples: [soroban-examples](https://github.com/stellar/soroban-examples) (liquidity pool, atomic swap, timelock, single-offer) and the [DeFi tutorials](https://developers.stellar.org/docs/build/apps/guestbook).

## Contract size

The 64KB limit is real and the release profile in [SKILL.md](#project-setup) is mandatory. If you still exceed it:

```bash
ls -la target/wasm32-unknown-unknown/release/*.wasm   # check size
cargo install cargo-bloat
cargo bloat --release --target wasm32-unknown-unknown # find heavy deps
```

Then: split the contract, drop heavy dependencies, prefer `symbol_short!`, avoid large static data.

## Resource optimization

Fees are multidimensional (CPU instructions, ledger reads/writes, bytes, events, rent):

- Minimize storage reads/writes; batch where possible
- Avoid unbounded loops over user-controlled collections
- Reduce cross-contract calls in hot paths
- Use events instead of storage for data that only needs off-chain visibility
- Profile with `stellar contract invoke ... --send=no` before optimizing blind

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `contract exceeds maximum size` | WASM > 64KB | See [Contract size](#contract-size) |
| `cannot find macro println` / `std` errors | Missing `#![no_std]` | Add as first line of `lib.rs`; use SDK types |
| Calls fail after inactivity, data "missing" | Storage TTL expired → archived | Extend TTLs proactively; restore archived entries |
| Temporary data vanished | Wrong storage type | Use `persistent()` for data that must survive |
| `Error: identity "alice" not found` | CLI identity missing | `stellar keys generate --global alice --network testnet --fund` |
| `invalid argument format` on invoke | Wrong CLI arg syntax | Plain strings for addresses; JSON for complex types |
| `transaction simulation failed` | Soroban tx not simulated/assembled | Simulate, then `assembleTransaction` before signing |
| `tx_bad_auth` | Wrong network passphrase or signer | Match passphrase to network; check signing identity |
| `tx_bad_seq` | Stale sequence number | Reload the account before building the tx |

Client-side issues (wallet detection, trustlines, transaction building from JS) are covered in `/.well-known/agent-skills/dapp/skill.md` and `/.well-known/agent-skills/data/skill.md`.


---

# Testing

Testing strategy for Stellar smart contracts, from fast native unit tests to mainnet-fork tests. Companion to [SKILL.md](#stellar-smart-contracts), [development.md](#development-patterns), and [security.md](#security).

Layers, fastest first:

1. **Unit tests** — native Rust with `soroban-sdk` testutils (not WASM, full debugger support)
2. **Local integration** — Stellar Quickstart container
3. **Testnet** — public network rehearsal
4. **Fork tests** — replay against real ledger state

## Unit testing

```rust
#![cfg(test)]
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env,
};
use crate::{Contract, ContractClient};

#[test]
fn test_basic() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());      // () = no constructor args
    let client = ContractClient::new(&env, &contract_id);
    let user = Address::generate(&env);

    client.initialize(&user);
    assert_eq!(client.get_value(), 0);
}
```

`env.register` takes constructor args as its second parameter — `env.register(Contract, (admin.clone(),))` for a contract with `__constructor(env, admin)`.

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

### Time and ledger state

```rust
env.ledger().set_timestamp(1000);          // for vesting/timelock logic
env.ledger().set_sequence_number(1000);
// ... act, then advance:
env.ledger().set_timestamp(2500);
```

### Events

```rust
let events = env.events().all();
assert_eq!(events.len(), 1);
// each event = (contract_id, topics: Vec<Val>, data: Val)
```

### Storage TTL

```rust
let ttl = env.as_contract(&contract_id, || {
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
stellar keys generate --global test-account --network local --fund
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/contract.wasm \
  --source test-account --network local
```

Endpoints: RPC `http://localhost:8000/soroban/rpc`, Horizon `http://localhost:8000`, passphrase `"Standalone Network ; February 2017"`.

## Testnet

```bash
stellar keys generate --global my-key --network testnet --fund
stellar contract deploy --wasm ... --source my-key --network testnet
```

- RPC: `https://soroban-testnet.stellar.org` · Horizon: `https://horizon-testnet.stellar.org`
- Passphrase: `"Test SDF Network ; September 2015"` · Friendbot: `https://friendbot.stellar.org`
- **Testnet resets quarterly** — everything is deleted. Script your deployments; never treat testnet state as durable.

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
const result = await rpc.sendTransaction(prepared);
```

In Rust, gate network-dependent tests behind `#[ignore]` and run them with `cargo test -- --ignored` in environments where the network is up.

## Fuzz testing

All `#[contracttype]` types implement `SorobanArbitrary` under the `testutils` feature, so fuzzing works out of the box with `cargo-fuzz`:

```bash
rustup install nightly
cargo install --locked cargo-fuzz
cargo fuzz init
```

`Cargo.toml` needs `crate-type = ["lib", "cdylib"]`; add `soroban-sdk = { version = "...", features = ["testutils"] }` to `fuzz/Cargo.toml`.

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

    client.initialize(&user);
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

- **Test snapshots**: every test writes a JSON snapshot of events + final ledger state to `test_snapshots/`. Commit them — diffs expose unintended behavioral changes. [Docs](https://developers.stellar.org/docs/build/guides/testing/differential-tests-with-test-snapshots)
- **Fork testing**: `stellar snapshot create --address C... --output json --out snapshot.json`, then `Env::from_ledger_snapshot_file("snapshot.json")` to test against real network state. Also useful for upgrade rehearsals: `stellar contract fetch --id C... --out-file deployed.wasm`, register both old and new versions, compare behavior. [Docs](https://developers.stellar.org/docs/build/guides/testing/fork-testing)
- **Mutation testing**: `cargo install --locked cargo-mutants && cargo mutants` — mutates your source and reports `MISSED` where tests didn't notice. [Docs](https://developers.stellar.org/docs/build/guides/testing/mutation-testing)

## Resource profiling

```bash
stellar contract invoke --id CONTRACT_ID --source alice --network testnet \
  --send=no -- function_name --arg value
```

Simulation reports CPU instructions, ledger reads/writes, and fees without submitting.

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
      - run: rustup target add wasm32-unknown-unknown
      - run: cargo test
      - run: cargo build --release --target wasm32-unknown-unknown
```

For integration jobs, run `stellar/quickstart` as a service container and deploy with the CLI (`cargo install stellar-cli --locked`).

## Checklist

- [ ] Unit tests cover all public functions, including error paths
- [ ] Edge cases: zero amounts, max values, empty state
- [ ] Authorization verified with `env.auths()` or specific `mock_auths`
- [ ] Events asserted
- [ ] Storage TTL behavior validated
- [ ] Cross-contract interactions tested against real WASM
- [ ] Fuzz targets for value-moving paths (deposit, withdraw, swap)
- [ ] Property tests for invariants
- [ ] Test snapshots committed
- [ ] Integration test against local network in CI
- [ ] Testnet rehearsal before mainnet


---

# Security

Security review guide for Stellar smart contracts. Companion to [SKILL.md](#stellar-smart-contracts), [development.md](#development-patterns), and [testing.md](#testing).

## Threat model

Assume the attacker controls:

- All arguments passed to contract functions
- Transaction ordering and timing
- All accounts except those requiring signatures
- The ability to deploy contracts that mimic your interface

## What the platform rules out

- **No `delegatecall`** — contracts cannot execute foreign bytecode in their own context; proxy-style hijacks don't exist.
- **No classical reentrancy** — execution is synchronous; the Ethereum-style cross-contract reentrancy class is absent (self-reentrancy is possible but rarely exploitable).
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

Every privileged path needs `require_auth()` on the right address. Auth variants: [development.md](#authorization).

### 2. Reinitialization attacks

Only relevant if you use a guarded `initialize` instead of a `__constructor` (which can't re-run):

```rust
// GOOD: refuses second call
pub fn initialize(env: Env, admin: Address) {
    if env.storage().instance().has(&DataKey::Admin) {
        panic!("already initialized");
    }
    env.storage().instance().set(&DataKey::Admin, &admin);
}
```

### 3. Arbitrary contract calls

Calling whatever address a user passes lets an attacker substitute a contract that mimics the interface:

```rust
// GOOD: allowlist external contracts
pub fn swap(env: Env, token: Address, amount: i128) {
    let allowed: Vec<Address> = env.storage().instance().get(&DataKey::AllowedTokens).unwrap();
    if !allowed.contains(&token) {
        panic!("token not allowed");
    }
    let client = token::Client::new(&env, &token);
    // ...
}
```

### 4. Integer overflow/underflow

`overflow-checks = true` in the release profile catches overflows at runtime (panic), but explicit checked math fails cleaner and survives profile mistakes:

```rust
let new_balance = balance.checked_add(amount).expect("overflow");
```

Also validate sign and range on inputs (`amount <= 0` checks) — `i128` amounts can be negative.

### 5. Storage key collisions

Untyped keys can silently overwrite unrelated data. Always use a `#[contracttype]` key enum — see [development.md](#typed-storage-keys).

### 6. Check-then-act races

State can change between transactions. Do checks and state changes atomically within one invocation, and take slippage bounds (`min_out`) from the caller:

```rust
pub fn swap(env: Env, user: Address, amount_in: i128, min_out: i128) {
    user.require_auth();
    let amount_out = calculate_output(amount_in);
    if amount_out < min_out {
        panic!("slippage exceeded");
    }
    // update all state in this same invocation
}
```

### 7. TTL/archival failures

If critical state expires, the contract breaks (or worse, behaves as if state never existed). Extend TTLs in hot paths and monitor entry TTLs in production — see [development.md](#ttl-management).

### 8. Trusting cross-contract return values

Validate data from external contracts — allowlist oracles, sanity-check magnitudes, enforce freshness:

```rust
let price: i128 = oracle_client.get_price(&asset);
if price <= 0 || price > MAX_REASONABLE_PRICE {
    panic!("invalid price");
}
```

## Classic-side risks (for contracts touching assets)

- **Trustline spoofing**: display and verify full asset code + issuer; honor curated lists (`stellar.toml`).
- **Clawback**: assets with `auth_clawback_enabled` can be seized by the issuer — check issuer flags before treating balances as final.
- Asset semantics live in `/.well-known/agent-skills/assets/skill.md`.

## Checklists

### Contract

- [ ] All privileged functions require appropriate authorization
- [ ] Initialization can only happen once (or uses `__constructor`)
- [ ] External contract calls validated/allowlisted
- [ ] Arithmetic checked; input signs and ranges validated
- [ ] Storage keys typed and collision-free
- [ ] Critical TTLs extended proactively; archival behavior considered
- [ ] Events emitted for auditable state changes
- [ ] Upgrade path gated, tested (happy + failure), and replay-safe
- [ ] Emergency controls (pause) and incident runbook defined for value-bearing contracts

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

Before requesting an audit: run the static analyzers, complete the checklists above, document your threat model and trust assumptions, and have the test suite from [testing.md](#testing) green — auditors' time is better spent on logic than on lint.
