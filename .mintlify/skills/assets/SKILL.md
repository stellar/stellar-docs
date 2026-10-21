---
name: assets
description: Stellar Assets (classic) + trustlines + Stellar Asset Contract (SAC) bridge to smart contracts. Covers asset issuance, distribution, authorization flags, clawback, regulated assets, trustline management, and the SAC interop layer that exposes classic assets as SEP-41 contract tokens. Use when tokenizing real-world assets, issuing stablecoins, managing trustlines, or bridging classic assets to smart contracts.
user-invocable: true
argument-hint: "[asset task]"
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

// 1. Create issuing account (should be separate from distribution)
const issuerKeypair = StellarSdk.Keypair.random();
const distributorKeypair = StellarSdk.Keypair.random();

// 2. Fund accounts (testnet)
await fetch(`https://friendbot.stellar.org?addr=${issuerKeypair.publicKey()}`);
await fetch(`https://friendbot.stellar.org?addr=${distributorKeypair.publicKey()}`);
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

For fixed-supply tokens, lock the issuer:

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
// Issuer can never issue more tokens
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
      limit: "10000", // 0 to remove trustline
    })
  )
  .setTimeout(180)
  .build();
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
  --source alice \
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

### SEP-0010 (Web Authentication)

Authenticate users with their Stellar accounts:

```typescript
// Server generates challenge
// Client signs with wallet
// Server verifies signature
```

### SEP-0024 (Hosted Deposit/Withdrawal)

For fiat on/off ramps:

```typescript
// Interactive flow for deposits/withdrawals
// Anchor handles KYC and fiat transfer
```

### SEP-0045 (Web Auth for Contract Accounts)

Extends SEP-10 to support contract accounts (`C...` addresses) for web authentication. Required for smart wallet / passkey-based anchor integrations. See [SEP-0045](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0045.md).

### SEP-0050 (Non-Fungible Tokens)

Standard contract interface for NFTs on Stellar. Reference implementations available in [OpenZeppelin Stellar Contracts](https://github.com/OpenZeppelin/stellar-contracts) with Base, Consecutive, and Enumerable variants. See [SEP-0050](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0050.md).

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

### Security
- Validate asset issuer, not just code
- Be cautious of assets with clawback enabled
- Verify stellar.toml from authoritative source
- Use well-known asset lists for common tokens
