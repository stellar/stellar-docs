---
name: data
description: Querying Stellar chain data via Stellar RPC (preferred) and Horizon (legacy). Covers RPC JSON-RPC methods, Horizon REST endpoints, streaming, pagination, historical queries, Hubble/Galexie for deep history, and the RPC/Horizon migration story. Use when reading balances, transactions, operations, ledgers, contract events, or building any indexer/analytics workflow.
user-invocable: true
argument-hint: "[data task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Stellar Data: RPC + Horizon

API access for reading chain state. Stellar RPC is the preferred entry point for new projects; Horizon remains for legacy and historical-query workflows. For deeper history beyond RPC's 7-day window, use Hubble/Galexie.

## When to use this skill
- Calling Stellar RPC methods (`getLatestLedger`, `getLedgerEntries`, `getEvents`, `simulateTransaction`, `sendTransaction`)
- Querying Horizon endpoints (accounts, transactions, operations, effects, ledgers)
- Streaming live events or operations
- Pulling historical data beyond RPC's 7-day window (Hubble, Galexie)
- Choosing between RPC and Horizon for a given workflow

## Related skills
- Building transactions to send → `/.well-known/agent-skills/dapp/skill.md`
- Smart contract simulation and event emission → `/.well-known/agent-skills/smart-contracts/skill.md`
- Asset balance and trustline lookups → `/.well-known/agent-skills/assets/skill.md`
- Standards (SEP-7 deeplinks, SEP-10 auth) → `/.well-known/agent-skills/standards/skill.md`

---


## Overview

Stellar provides two API paradigms:

| API | Status | Use Case |
|-----|--------|----------|
| **Stellar RPC** | Preferred | Smart contracts, real-time state, new projects |
| **Horizon** | Legacy-focused | Historical data, legacy applications |

**Recommendation**: Use Stellar RPC for all new projects. Use Horizon mainly for historical queries and legacy compatibility paths.

## Read the file that matches the task

| Task | Section |
|------|------|
| RPC methods and usage | [Stellar RPC](#stellar-rpc) (below) |
| Horizon endpoints, common operations, streaming, pagination | [Horizon API (Legacy)](#horizon-api-legacy) |
| Migration strategy | [Migration: Horizon to RPC](#migration-horizon-to-rpc) (below) |
| Data history/indexing options | [Historical Data Access](#historical-data-access) (below) |
| Environment setup and endpoints | [Network Configuration](#network-configuration) (below) |

## Stellar RPC

### Endpoints

> Note: SDF directly provides Futurenet public RPC. For Mainnet RPC, select a provider from the [RPC providers directory](https://developers.stellar.org/docs/data/apis/rpc/providers).

| Network | RPC URL |
|---------|---------|
| Mainnet | Provider-specific endpoint (see [RPC providers directory](https://developers.stellar.org/docs/data/apis/rpc/providers)) |
| Testnet | `https://soroban-testnet.stellar.org` |
| Futurenet | `https://rpc-futurenet.stellar.org` |
| Local | `http://localhost:8000/soroban/rpc` |

### Setup

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

const rpc = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");
```

### Key Methods

#### Get Account

```typescript
const account = await rpc.getAccount(publicKey);
// Returns account with sequence number for transaction building
```

#### Get Health

```typescript
const health = await rpc.getHealth();
// { status: "healthy" }
```

#### Get Latest Ledger

```typescript
const ledger = await rpc.getLatestLedger();
// { id: "...", sequence: 123456, protocolVersion: 25 }
```

#### Get Ledger Entries

```typescript
// Read contract storage
const key = StellarSdk.xdr.LedgerKey.contractData(
  new StellarSdk.xdr.LedgerKeyContractData({
    contract: new StellarSdk.Address(contractId).toScAddress(),
    key: StellarSdk.xdr.ScVal.scvSymbol("Counter"),
    durability: StellarSdk.xdr.ContractDataDurability.persistent(),
  })
);

const entries = await rpc.getLedgerEntries(key);
if (entries.entries.length > 0) {
  const value = StellarSdk.scValToNative(
    entries.entries[0].val.contractData().val()
  );
}
```

#### Simulate Transaction

```typescript
const simulation = await rpc.simulateTransaction(transaction);

if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
  console.error("Simulation failed:", simulation.error);
} else if (StellarSdk.rpc.Api.isSimulationSuccess(simulation)) {
  console.log("Cost:", simulation.cost);
  console.log("Result:", simulation.result);
}
```

#### Send Transaction

```typescript
// status: "PENDING" | "DUPLICATE" | "TRY_AGAIN_LATER" | "ERROR"
let response = await rpc.sendTransaction(signedTransaction);

// TRY_AGAIN_LATER: not queued. Usually this source account already has a
// transaction in flight, so resending the same signed transaction is safe.
// If the queue was full, stellar-core bans this exact transaction for 10
// ledgers, so resends keep failing: rebuild it with a higher fee instead.
for (let i = 0; response.status === "TRY_AGAIN_LATER" && i < 5; i++) {
  await new Promise((r) => setTimeout(r, 2000));
  response = await rpc.sendTransaction(signedTransaction);
}

if (response.status === "ERROR") {
  // Rejected by stellar-core. The SDK parses the raw errorResultXdr field
  // into errorResult (a TransactionResult).
  throw new Error("Transaction rejected", { cause: response.errorResult });
}
if (response.status === "TRY_AGAIN_LATER") {
  throw new Error("Not queued; rebuild with a higher fee or resubmit later");
}

// PENDING (queued now) or DUPLICATE (already queued): poll for the result.
// pollTransaction tries 30 times, 1s apart, by default.
const result = await rpc.pollTransaction(response.hash);

if (result.status === "SUCCESS") {
  console.log("Success:", result.returnValue);
} else if (result.status === "FAILED") {
  console.error("Failed on-chain:", result.resultXdr); // a TransactionResult
} else {
  console.error("Not confirmed yet (NOT_FOUND); check getTransaction later");
}
```

`DUPLICATE` means the same transaction is still in the queue. Once it is applied, sending it again returns `ERROR` (`txBAD_SEQ`). So before you treat `ERROR` on a resend as a failure, call `getTransaction(hash)`.

#### Get Transaction

```typescript
const tx = await rpc.getTransaction(txHash);
// status: "SUCCESS" | "FAILED" | "NOT_FOUND"
// returnValue: ScVal (for contract calls)
// ledger: number
```

#### Get Events

```typescript
const events = await rpc.getEvents({
  startLedger: 1000000,
  filters: [
    {
      type: "contract",
      contractIds: [contractId],
      topics: [
        ["*", StellarSdk.xdr.ScVal.scvSymbol("transfer").toXDR("base64")],
      ],
    },
  ],
});

for (const event of events.events) {
  console.log("Event:", event.topic, event.value);
}
```

### RPC Limitations

- **7-day history for most methods**: `getTransaction`, `getEvents`, etc. only cover recent data
- **`getLedgers` exception**: on a data-lake-backed provider, "Infinite Scroll" pages back past the retention window — as far as that provider's data lake reaches (potentially genesis). On a plain RPC instance it is bounded by `getHealth().oldestLedger`; requests older than that fail with `-32600`. Check before assuming depth.
- **No streaming**: Poll for updates (no WebSocket)
- **Contract-focused**: Limited classic Stellar data


## Migration: Horizon to RPC

### Account Loading

```typescript
// Horizon (old)
const account = await horizonServer.loadAccount(publicKey);

// RPC (new)
const account = await rpc.getAccount(publicKey);
// Note: RPC returns less data, just what's needed for transactions
```

### Transaction Submission

```typescript
// Horizon (for classic transactions)
const result = await horizonServer.submitTransaction(tx);

// RPC (for smart contract transactions)
const response = await rpc.sendTransaction(tx); // branch on response.status (see Send Transaction)
const result = await rpc.pollTransaction(response.hash);
```

### Historical Data

```typescript
// Horizon - full history
const allTxs = await horizonServer
  .transactions()
  .forAccount(publicKey)
  .call();

// RPC - most methods limited to the retention window (~7 days)
// Exception: getLedgers can page further back (Infinite Scroll), but only as far
// as the chosen provider's retention or data-lake integration reaches.
// Always check the floor of the instance you're talking to first:
const { oldestLedger } = await rpc.getHealth();
// For guaranteed full history, use:
// 1. Hubble (SDF's BigQuery dataset)
// 2. Galexie (data pipeline)
// 3. Your own indexer
```

### Streaming Replacement

```typescript
// Horizon - native streaming
server.payments().stream({ onmessage: handlePayment });

// RPC - polling (no native streaming)
async function pollForUpdates() {
  const lastLedger = await rpc.getLatestLedger();
  // Check for new events/transactions
  // Repeat on interval
}
setInterval(pollForUpdates, 5000);
```

## Historical Data Access

For data older than the RPC retention window (~7 days — not available via most RPC methods; `getLedgers` reaches further only on data-lake-backed providers, see [Data Lake](#data-lake) below):

### Hubble (BigQuery)

```sql
-- Query Stellar data in BigQuery
SELECT *
FROM `crypto-stellar.crypto_stellar.history_transactions`
WHERE source_account = 'G...'
ORDER BY created_at DESC
LIMIT 100
```

### Galexie

Self-hosted data pipeline for processing Stellar ledger data:
- https://github.com/stellar/galexie

### Data Lake

RPC "Infinite Scroll" is powered by the Stellar data lake — a cloud-based object store (SEP-0054 format). Deep `getLedgers` history is a property of the **provider**, not the method: an instance only serves history past its retention window if its operator wired a data lake in. Instances without one (the public SDF testnet RPC included) reject older start ledgers with JSON-RPC `-32600` — compare your target against `getHealth().oldestLedger` before paging back.
- **Public access**: `s3://aws-public-blockchain/v1.1/stellar/ledgers/pubnet` (AWS Open Data)
- **Self-host**: Use Galexie to export to AWS S3 or Google Cloud Storage
- **Hosted**: [Quasar (Lightsail Network)](https://quasar.lightsail.network) provides hosted Galexie Data Lake + Archive RPC endpoints
- **Size**: ~3.8TB, growing ~0.5TB/year
- **Cost**: ~$160/month self-hosted ($60 compute + $100 storage)
- **Docs**: https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration

### Third-Party Indexers

For complex queries, event streaming, or custom data pipelines beyond what RPC/Horizon provide:

- **Mercury** — Stellar-native indexer with Retroshades, GraphQL API (https://mercurydata.app)
- **SubQuery** — Multi-chain indexer with Stellar support, event handlers (https://subquery.network)
- **Goldsky** — Real-time data replication pipelines and subgraphs (https://goldsky.com)
- **StellarExpert API** — Free, no-auth REST API for assets, accounts, ledger resolution (https://stellar.expert/openapi.html)

See the full indexer directory: https://developers.stellar.org/docs/data/indexers

## Network Configuration

> For a React/Next.js-specific setup, see the [dapp skill](/.well-known/agent-skills/dapp/skill.md).
> For mainnet RPC, set `STELLAR_MAINNET_RPC_URL` from a provider in the [RPC providers directory](https://developers.stellar.org/docs/data/apis/rpc/providers).

### Environment-Based Setup

```typescript
// lib/stellar-config.ts
import * as StellarSdk from "@stellar/stellar-sdk";

type NetworkConfig = {
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  friendbotUrl: string | null;
};

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

// Lazy per-network factories: requireEnv only runs for the selected network,
// so testnet/local work without the mainnet env var set.
const configs: Record<string, () => NetworkConfig> = {
  mainnet: () => ({
    rpcUrl: requireEnv("STELLAR_MAINNET_RPC_URL"),
    horizonUrl: "https://horizon.stellar.org",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    friendbotUrl: null,
  }),
  testnet: () => ({
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
    friendbotUrl: "https://friendbot.stellar.org",
  }),
  local: () => ({
    rpcUrl: "http://localhost:8000/soroban/rpc",
    horizonUrl: "http://localhost:8000",
    networkPassphrase: "Standalone Network ; February 2017",
    friendbotUrl: "http://localhost:8000/friendbot",
  }),
};

const network = process.env.STELLAR_NETWORK || "testnet";
const makeConfig = configs[network];
if (!makeConfig) throw new Error(`Unknown network: ${network}`);
export const config = makeConfig();

export const rpc = new StellarSdk.rpc.Server(config.rpcUrl);
export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);
```

## Best Practices

### Use RPC for:
- New application development
- Smart contract interactions
- Transaction simulation and submission
- Real-time account state

### Use Horizon for:
- Historical transaction queries
- Payment streaming
- Legacy application maintenance
- Rich account metadata

### Error Handling

```typescript
// RPC: a rejected transaction does not throw. sendTransaction returns
// status "ERROR" (see Send Transaction). The SDK throws only JSON-RPC
// errors ({ code, message }, e.g. malformed params) and HTTP/network failures.
try {
  const response = await rpc.sendTransaction(tx);
  if (response.status === "ERROR") {
    // Rejected: inspect response.errorResult
  }
} catch (error) {
  console.error("RPC call failed:", error); // JSON-RPC { code, message } or HTTP error
}

// Horizon errors
try {
  const result = await horizon.submitTransaction(tx);
} catch (error) {
  const extras = error.response?.data?.extras;
  if (extras?.result_codes) {
    // Detailed error codes
    console.log("Transaction:", extras.result_codes.transaction);
    console.log("Operations:", extras.result_codes.operations);
  }
}
```

### Rate Limiting

Both RPC and Horizon have rate limits:
- Use exponential backoff for retries
- Cache responses where appropriate
- Consider running your own nodes for high-volume applications

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.response?.status === 429) {
        // Rate limited - exponential backoff
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}
```

---

# Horizon API (Legacy)

Horizon REST endpoints, common operations, streaming, and pagination. Companion to [SKILL.md](#stellar-data-rpc--horizon) — new projects should prefer Stellar RPC; see the [migration guide](#migration-horizon-to-rpc).

### Endpoints

| Network | Horizon URL |
|---------|-------------|
| Mainnet | `https://horizon.stellar.org` |
| Testnet | `https://horizon-testnet.stellar.org` |
| Local | `http://localhost:8000` |

### Setup

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
```

### Common Operations

#### Load Account

```typescript
const account = await server.loadAccount(publicKey);
// Full account details including balances, signers, data
```

#### Get Account Balances

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

#### Get Transactions

```typescript
// Account transactions
const transactions = await server
  .transactions()
  .forAccount(publicKey)
  .order("desc")
  .limit(10)
  .call();

// Specific transaction
const tx = await server
  .transactions()
  .transaction(txHash)
  .call();
```

#### Get Operations

```typescript
const operations = await server
  .operations()
  .forAccount(publicKey)
  .order("desc")
  .limit(20)
  .call();

for (const op of operations.records) {
  console.log(op.type, op.created_at);
}
```

#### Get Payments

```typescript
const payments = await server
  .payments()
  .forAccount(publicKey)
  .order("desc")
  .call();

for (const payment of payments.records) {
  if (payment.type === "payment") {
    console.log(
      `${payment.from} -> ${payment.to}: ${payment.amount} ${payment.asset_code || "XLM"}`
    );
  }
}
```

#### Get Effects

```typescript
const effects = await server
  .effects()
  .forAccount(publicKey)
  .limit(50)
  .call();
```

#### Streaming (Server-Sent Events)

Reconnecting at `"now"` silently drops everything that arrived while the
connection was down. Persist each record's `paging_token` and resume from it:

```typescript
// Durable in production (DB/Redis) — an in-memory cursor is lost on restart.
let cursor = (await loadCursor()) ?? "now";
let closeHandler: (() => void) | undefined;

function subscribe() {
  closeHandler = server
    .transactions()
    .forAccount(publicKey)
    .cursor(cursor)
    .stream({
      onmessage: (tx) => {
        console.log("New transaction:", tx.hash);
        // Advance only after handling, so a crash mid-work replays the record.
        cursor = tx.paging_token;
        void saveCursor(cursor);
      },
      onerror: (error) => {
        console.error(`Stream error, resuming from ${cursor}:`, error);
        closeHandler?.();
        setTimeout(subscribe, 5_000); // back off, then resume from the cursor
      },
    });
}

subscribe();

// Close stream when done
closeHandler?.();
```

Resuming replays the record at the cursor, so make `onmessage` idempotent
(key off `tx.hash`) rather than assuming exactly-once delivery.

#### Submit Transaction

```typescript
try {
  const result = await server.submitTransaction(signedTransaction);
  console.log("Success:", result.hash);
} catch (error) {
  if (error.response?.data?.extras?.result_codes) {
    console.error("Error codes:", error.response.data.extras.result_codes);
  }
}
```

### Pagination

```typescript
// First page
let page = await server.transactions().forAccount(publicKey).limit(10).call();

// Next page
if (page.records.length > 0) {
  page = await page.next();
}

// Previous page
page = await page.prev();
```
