---
name: assets
description: Stellar Assets (classic) + trustlines + Stellar Asset Contract (SAC) bridge to smart contracts. Covers asset issuance, distribution, authorization flags, clawback, regulated assets, trustline management, and the SAC interop layer that exposes classic assets as SEP-41 contract tokens. Use when tokenizing real-world assets, issuing stablecoins, managing trustlines, or bridging classic assets to smart contracts.
user-invocable: true
argument-hint: "[asset task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Stellar Assets, Trustlines, and SAC

Stellar's native token mechanism: classic asset issuance, trustlines, and the Stellar Asset Contract (SAC) bridge that makes classic assets usable from smart contracts. Default to classic assets over custom contract tokens unless you need custom logic.

## When to use this skill
- Issuing a new asset (stablecoin, security token, utility token)
- Setting up trustlines from a client or contract
- Managing issuer flags (auth required, auth revocable, clawback)
- Bridging a classic asset into a smart contract via SAC
- Building regulated-asset flows (compliance, KYC, freeze)

## Related skills
- Custom token contracts (when classic isn't enough) → `/.well-known/agent-skills/smart-contracts/skill.md`
- UI flows for trustline creation and asset display → `/.well-known/agent-skills/dapp/skill.md`
- Looking up balances and trustline state → `/.well-known/agent-skills/data/skill.md`
- Token-related SEPs (SEP-41, SEP-7, etc.) → `/.well-known/agent-skills/standards/skill.md`

---


## Overview

Stellar has two token mechanisms:

1. **Stellar Assets (Classic)**: Built-in, highly efficient, full ecosystem support
2. **Contract tokens (SEP-41)**: Custom contracts with flexible logic

**Recommendation**: Prefer Stellar Assets unless you need custom token logic.

## Stellar Assets (Classic)

### Asset Types

| Type | Description |
|------|-------------|
| Native (XLM) | Stellar's native currency, no trustline needed |
| Credit | Issued by an account, requires trustline |
| Liquidity Pool Shares | Represent LP positions |

### Asset Identifiers

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

// Native XLM
const xlm = StellarSdk.Asset.native();

// Credit asset (code + issuer)
const usdc = new StellarSdk.Asset(
  "USDC",
  "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
);

// Asset code rules:
// - 1-4 chars: alphanumeric (credit_alphanum4)
// - 5-12 chars: alphanumeric (credit_alphanum12)
```

## Issuing Assets

### Create Issuing Account

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const rpcServer = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");

// 1. Create issuing account (should be separate from distribution)
const issuerKeypair = StellarSdk.Keypair.random();
const distributorKeypair = StellarSdk.Keypair.random();

// 2. Fund accounts (testnet). fundAddress throws if funding fails.
await rpcServer.fundAddress(issuerKeypair.publicKey());
await rpcServer.fundAddress(distributorKeypair.publicKey());
```

### Issue Asset

```typescript
const asset = new StellarSdk.Asset("MYTOKEN", issuerKeypair.publicKey());

// 1. Distributor creates trustline to issuer
const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());

const trustlineTx = new StellarSdk.TransactionBuilder(distributorAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.changeTrust({
      asset: asset,
      limit: "1000000", // Max amount to hold
    })
  )
  .setTimeout(180)
  .build();

trustlineTx.sign(distributorKeypair);
await server.submitTransaction(trustlineTx);

// 2. Issuer sends tokens to distributor
const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());

const issueTx = new StellarSdk.TransactionBuilder(issuerAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.payment({
      destination: distributorKeypair.publicKey(),
      asset: asset,
      amount: "1000000",
    })
  )
  .setTimeout(180)
  .build();

issueTx.sign(issuerKeypair);
await server.submitTransaction(issueTx);
```

### Lock Issuing Account

For fixed-supply tokens, lock the issuer. Master weight 0 disables only the master key, so first remove any other signers (or confirm their combined weight can never meet the account's thresholds):

```typescript
const lockTx = new StellarSdk.TransactionBuilder(issuerAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.setOptions({
      masterWeight: 0, // Disable master key
    })
  )
  .setTimeout(180)
  .build();

lockTx.sign(issuerKeypair);
await server.submitTransaction(lockTx);
// With no other signers, the issuer can never issue more tokens
```

## Asset Flags

Configure issuer account flags for compliance:

```typescript
const setFlagsTx = new StellarSdk.TransactionBuilder(issuerAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.setOptions({
      setFlags:
        StellarSdk.AuthRequiredFlag |    // Trustlines require approval
        StellarSdk.AuthRevocableFlag |   // Can freeze trustlines
        StellarSdk.AuthClawbackEnabledFlag, // Can clawback tokens
    })
  )
  .setTimeout(180)
  .build();
```

### Flag Descriptions

| Flag | Effect |
|------|--------|
| `AUTH_REQUIRED` | Users must get approval before receiving tokens |
| `AUTH_REVOCABLE` | Issuer can freeze user balances |
| `AUTH_IMMUTABLE` | Flags cannot be changed (permanent) |
| `AUTH_CLAWBACK_ENABLED` | Issuer can clawback tokens from accounts |

### Authorize Trustline

```typescript
// When AUTH_REQUIRED is set, approve trustlines:
const authorizeTx = new StellarSdk.TransactionBuilder(issuerAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.setTrustLineFlags({
      trustor: userPublicKey,
      asset: asset,
      flags: {
        authorized: true,
        // authorizedToMaintainLiabilities: true, // Partial auth
      },
    })
  )
  .setTimeout(180)
  .build();
```

### Clawback Tokens

```typescript
// Requires AUTH_CLAWBACK_ENABLED flag
const clawbackTx = new StellarSdk.TransactionBuilder(issuerAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.clawback({
      asset: asset,
      from: targetAccountId,
      amount: "100",
    })
  )
  .setTimeout(180)
  .build();
```

## Trustlines

### Create Trustline

```typescript
const changeTrustTx = new StellarSdk.TransactionBuilder(userAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.changeTrust({
      asset: asset,
      limit: "10000", // Max amount to hold (see "Remove Trustline" for limit: "0")
    })
  )
  .setTimeout(180)
  .build();
```

### Remove Trustline

`ChangeTrust` with `limit: "0"` deletes a trustline, but only if the trustline
is in a deletable state. Before submitting:

1. **Identify the asset by code AND issuer.** A wallet-display entry or a
   claimable balance is not a trustline — only an actual classic asset
   trustline (or liquidity pool share) on the account can be removed with
   `ChangeTrust`. Claimable balances are removed by claiming or clawing them
   back, not by `ChangeTrust`.
2. **Clear the balance.** The trustline balance must be exactly `0` — send
   remaining funds back to the issuer (burns them) or to another account.
3. **Clear offers / buying liabilities.** Open DEX offers that buy the asset
   create buying liabilities; cancel them before removal (`manageSellOffer`
   with `amount: "0"`, `manageBuyOffer` with `buyAmount: "0"`).
4. **Exit liquidity pool positions.** An asset trustline referenced by a
   liquidity pool (`liquidity_pool_use_count > 0`, per CAP-0038) cannot be
   deleted — withdraw from the pool and remove the pool-share trustline first.

```typescript
// 1. Check the trustline is deletable
const account = await server.loadAccount(userPublicKey);
const trustline = account.balances.find(
  (b) =>
    b.asset_type !== "native" &&
    b.asset_type !== "liquidity_pool_shares" &&
    b.asset_code === asset.getCode() &&
    b.asset_issuer === asset.getIssuer()
);

if (!trustline) throw new Error("No trustline (display/claimable state only?)");
if (parseFloat(trustline.balance) !== 0)
  throw new Error("Balance must be 0 — send funds away or back to issuer");
if (parseFloat(trustline.buying_liabilities) !== 0)
  throw new Error("Cancel open offers buying this asset first");

// Liquidity-pool usage (precondition 4) is not visible on this balance line —
// if the asset is still in one of the account's pools, the submit below fails
// with op_cannot_delete. Withdraw and remove the pool-share trustline first.

// 2. Submit removal and surface the specific result code
const removeTrustTx = new StellarSdk.TransactionBuilder(account, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.changeTrust({
      asset: asset,
      limit: "0", // Delete the trustline
    })
  )
  .setTimeout(180)
  .build();

removeTrustTx.sign(userKeypair);

try {
  await server.submitTransaction(removeTrustTx);
} catch (e) {
  const codes = e.response?.data?.extras?.result_codes?.operations ?? [];
  if (codes.includes("op_invalid_limit")) {
    // CHANGE_TRUST_INVALID_LIMIT: balance or buying liabilities remain
    throw new Error("Clear balance and open offers before removing trustline");
  }
  if (codes.includes("op_cannot_delete")) {
    // CHANGE_TRUST_CANNOT_DELETE: trustline is used by a liquidity pool
    throw new Error("Withdraw from liquidity pools referencing this asset first");
  }
  throw e;
}
```

### Check Trustline Status

```typescript
const account = await server.loadAccount(userPublicKey);
const trustline = account.balances.find(
  (b) =>
    b.asset_type !== "native" &&
    b.asset_code === "USDC" &&
    b.asset_issuer === usdcIssuer
);

if (trustline) {
  console.log("Balance:", trustline.balance);
  console.log("Limit:", trustline.limit);
  console.log("Authorized:", trustline.is_authorized);
}
```

## Stellar Asset Contract (SAC)

SAC provides a smart-contract interface for Stellar Assets, enabling smart contract interactions.

### Deploy SAC for Existing Asset

```bash
# Get the SAC address for an asset
stellar contract asset deploy \
  --asset USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN \
  --source-account alice \
  --network testnet
```

### SAC Address Derivation

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

const asset = new StellarSdk.Asset("USDC", issuerPublicKey);
const contractId = asset.contractId(StellarSdk.Networks.TESTNET);
// Returns the deterministic SAC contract address
```

### Using SAC in Smart Contracts

```rust
use soroban_sdk::{token::Client as TokenClient, Address, Env};

pub fn transfer_asset(
    env: Env,
    from: Address,
    to: Address,
    asset_contract: Address,
    amount: i128,
) {
    from.require_auth();

    // Use standard token interface
    let token = TokenClient::new(&env, &asset_contract);
    token.transfer(&from, &to, &amount);
}
```

### SAC vs Custom Token Interface

SAC implements the standard SEP-41 token interface:
- `balance(id: Address) -> i128`
- `transfer(from: Address, to: Address, amount: i128)`
- `approve(from: Address, spender: Address, amount: i128, expiration_ledger: u32)`
- `allowance(from: Address, spender: Address) -> i128`
- `decimals() -> u32`
- `name() -> String`
- `symbol() -> Symbol`

## When to Use What

### Use Stellar Assets When:
- Standard fungible token (currency, stablecoin)
- Need full ecosystem support (wallets, exchanges)
- Regulatory compliance features (freeze, clawback)
- Performance critical (classic operations are cheaper)
- DEX integration via order book

### Use Custom Contract Tokens When:
- Complex transfer logic (royalties, fees, restrictions)
- Custom authorization schemes
- Non-standard token behaviors
- Integration with custom DeFi contracts
- NFTs or semi-fungible tokens

> Reach for a fully custom token as a last resort. Many of the cases above
> (royalties, fees, transfer restrictions) can be built with a regular
> issued Stellar asset plus a thin "SAC admin" contract that drives the
> SAC's `mint`, `burn`, and `clawback` functions. That keeps the ecosystem
> compatibility of a normal asset (DEX, anchors, wallets, trustlines) while
> still layering on custom logic. Prefer a custom contract token only when
> you need token behavior the SAC genuinely cannot express.
>
> **This runs in production today.** USDT0
> (`USDT0:GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q`) is a
> classic asset whose SAC admin is a contract: a role-gated manager that
> forwards `mint`, `clawback`, `set_authorized`, and `set_admin` to the SAC,
> with a cross-chain bridge holding only the minter role. See
> [setting a custom SAC admin](https://developers.stellar.org/docs/build/guides/tokens/custom-sac-admin)
> for the pattern and `/.well-known/agent-skills/cross-chain/skill.md#layerzero-v2-on-stellar--omnichain-messaging-oft-and-usdt0` for that deployment.
>
> One hard prerequisite: **lock the issuer** (master key weight `0`).
> Payments from a classic issuer are minting, so an unlocked issuer can mint
> outside the contract and bypass the role model entirely.
>
> **Do it in this order: `set_admin` first, then lock the issuer.** A SAC's
> admin starts as the issuer account, and only the *current* admin can
> authorize the first `set_admin`. Lock the issuer before that call and the
> admin stays the locked issuer forever, because nobody can sign the handover
> ([SAC admin guide](https://developers.stellar.org/docs/build/guides/tokens/custom-sac-admin)).
> After the handover the SAC still mints under the new admin, so lock the
> issuer then.

### Use SAC When:
- Need a Stellar asset inside a smart contract
- Building DeFi protocols with existing assets
- Bridge between classic and smart contract operations

## Querying Assets

### Get Account Balances

```typescript
const account = await server.loadAccount(publicKey);

for (const balance of account.balances) {
  if (balance.asset_type === "native") {
    console.log("XLM:", balance.balance);
  } else {
    console.log(`${balance.asset_code}:`, balance.balance);
  }
}
```

### Find Assets

```typescript
// Search for assets by code
const assets = await server
  .assets()
  .forCode("USDC")
  .call();

// Get specific asset details
const assetDetails = await server
  .assets()
  .forCode("USDC")
  .forIssuer(issuerPublicKey)
  .call();
```

### Get Asset Statistics

```typescript
const stats = await server
  .assets()
  .forCode("USDC")
  .forIssuer(issuerPublicKey)
  .call();

// stats includes:
// - amount: total issued
// - num_accounts: trustline count
// - flags: issuer flags
```

## SEP Standards for Assets

### SEP-0001 (stellar.toml)

Publish asset metadata in your domain's `/.well-known/stellar.toml`:

```toml
[[CURRENCIES]]
code = "MYTOKEN"
issuer = "GABC..."
display_decimals = 2
name = "My Token"
desc = "A description of my token"
image = "https://example.com/token-logo.png"
```

### SEP-0008 (Regulated Assets)

Use [SEP-0008](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md) when the issuer must approve each transaction, not just each trustline. The issuer sets `AUTH_REQUIRED` and `AUTH_REVOCABLE`, publishes `regulated`, `approval_server` and `approval_criteria` in `[[CURRENCIES]]`, and runs an approval server that signs compliant transactions. Wallets POST each signed transaction to it and handle `success`, `revised`, `pending`, `action_required` and `rejected`. Setup, transaction shape and the full wallet flow: [Regulated Assets (SEP-0008)](#regulated-assets-sep-0008). For permissioned contract tokens, see SEP-0057 (T-REX, Draft) in [`/.well-known/agent-skills/standards/skill.md`](/.well-known/agent-skills/standards/skill.md).

### SEP-0010 (Web Authentication)

Authenticate users with their Stellar accounts. Flow: the server generates a challenge transaction, the client signs it with their wallet, and the server verifies the signature. See [SEP-0010](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md).

### SEP-0024 (Hosted Deposit/Withdrawal)

For fiat on/off ramps: an interactive webview flow where the anchor handles KYC and the fiat transfer. See [SEP-0024](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md).

### SEP-0045 (Web Auth for Contract Accounts)

Extends SEP-10 to support contract accounts (`C...` addresses) for web authentication. Required for smart wallet / passkey-based anchor integrations. Draft status; verify current status in [SEP-0045](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0045.md).

### SEP-0050 (Non-Fungible Tokens)

Standard contract interface for NFTs on Stellar. Reference implementations available in [OpenZeppelin Stellar Contracts](https://github.com/OpenZeppelin/stellar-contracts) with Base, Consecutive, and Enumerable variants. Draft status; verify current status in [SEP-0050](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0050.md).

## Best Practices

### Asset Issuance
- Use separate issuing and distribution accounts
- Lock issuer after initial distribution for fixed supply
- Publish stellar.toml with asset metadata
- Consider multisig for issuer account

### Trustline Management
- Check trustline exists before sending payments
- Handle trustline creation in onboarding flow
- Respect trustline limits
- Monitor for frozen/deauthorized status
- Before removing a trustline (`limit: "0"`): zero the balance, cancel offers
  buying the asset, and exit liquidity pools that reference it

### Security
- Validate asset issuer, not just code
- Be cautious of assets with clawback enabled
- Verify stellar.toml from authoritative source
- Use well-known asset lists for common tokens
- **Some live assets have no `stellar.toml` at all.** A missing `home_domain`
  is not evidence of a scam — USDT0 ships without one. Validate by issuer
  plus SAC derivation, never by the presence of `home_domain` or a
  `[[CURRENCIES]]` entry
- **When `AUTH_REVOCABLE` and `AUTH_CLAWBACK_ENABLED` are both set, check the
  issuer lock *and* the admin roles before listing the asset.** Those flags
  mean balances can be frozen or clawed back. A contract SAC admin does not
  contain that power on its own: an issuer whose master key still signs can
  mint, freeze and claw back directly, whatever the admin contract allows. So
  confirm the master key weight is `0`, then identify who holds the admin
  contract's roles

---

# Regulated Assets (SEP-0008)

Per-transaction issuer approval for classic assets. Companion to [SKILL.md](#stellar-assets-trustlines-and-sac); trustline authorization flags are covered there.

Use [SEP-0008](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md) when the issuer must approve each transaction, not just each trustline (securities, transfer limits, per-transfer compliance checks). SEP-0008 itself advises against it unless regulation requires it: it adds operational overhead and friction for users.

## Issuer setup

The issuer sets both `AUTH_REQUIRED` and `AUTH_REVOCABLE`, runs an approval server, and flags the asset in its `[[CURRENCIES]]` entry:

```toml
[[CURRENCIES]]
code = "MYTOKEN"
issuer = "GABC..."
regulated = true
approval_server = "https://example.com/tx-approve"
approval_criteria = "Transfers need a completed KYC check."
```

The approval server must allow cross-origin requests (`Access-Control-Allow-Origin: *`) so browser wallets can call it.

## Compliant transaction shape

An approvable transaction authorizes the accounts, moves the asset, then deauthorizes them, all in one atomic transaction. No account is left with an open authorized trustline:

```
1. Issuer authorizes account A for asset X
2. Issuer authorizes account B for asset X
3. Payment of X from A to B
4. Issuer deauthorizes account B
5. Issuer deauthorizes account A
```

To let an account keep offers open, end in the `AUTHORIZED_TO_MAINTAIN_LIABILITIES` state instead of full deauthorization.

## Wallet flow

Build and sign the transaction, then POST it as `tx` (base64 envelope XDR, JSON or form-encoded) to `approval_server`. Branch on the response `status`:

- `success`: the issuer signed it. Submit the returned `tx`.
- `revised`: the server added operations (typically the authorize and deauthorize operations around the user's own) and signed. Show `message`. Check that the original operations are unchanged and that no added operation uses the user's account as its source. Then have the user re-sign and submit.
- `pending`: wait `timeout` milliseconds (`0` means unknown), then resend the same `tx`.
- `action_required`: open `action_url` (`action_method` `GET` or `POST`, optional SEP-9 `action_fields`), then resend. Any status can come back.
- `rejected` (HTTP 400): show `error` and do not submit.

The approval server signs but never submits; the wallet submits. The Go reference server that SEP-0008 links was removed from `stellar/go-stellar-sdk` in October 2025, so plan to build your own.

SEP-0008 works on classic assets and trustline flags. For permissioned contract tokens see SEP-0057 (T-REX, Draft) in [`/.well-known/agent-skills/standards/skill.md`](/.well-known/agent-skills/standards/skill.md).
