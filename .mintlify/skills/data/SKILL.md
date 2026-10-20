---
name: data
description: Querying Stellar chain data via Stellar RPC (preferred) and Horizon (legacy). Covers RPC JSON-RPC methods, Horizon REST endpoints, streaming, pagination, historical queries, Hubble/Galexie for deep history, and the RPC/Horizon migration story. Use when reading balances, transactions, operations, ledgers, contract events, or building any indexer/analytics workflow.
user-invocable: true
argument-hint: "[data task]"
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

## Quick Navigation
- RPC methods and usage: [Stellar RPC](#stellar-rpc)
- Horizon endpoints and streaming: [Horizon API (Legacy)](#horizon-api-legacy)
- Migration strategy: [Migration: Horizon to RPC](#migration-horizon-to-rpc)
- Data history/indexing options: [Historical Data Access](#historical-data-access)
- Environment setup and endpoints: [Network Configuration](#network-configuration)

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
const response = await rpc.sendTransaction(signedTransaction);

if (response.status === "PENDING") {
  // Poll for result
  let result = await rpc.getTransaction(response.hash);
  while (result.status === "NOT_FOUND") {
    await new Promise(r => setTimeout(r, 1000));
    result = await rpc.getTransaction(response.hash);
  }

  if (result.status === "SUCCESS") {
    console.log("Success:", result.returnValue);
  } else {
    console.error("Failed:", result.status);
  }
}
```

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
- **`getLedgers` exception**: "Infinite Scroll" feature queries any ledger back to genesis via the data lake
- **No streaming**: Poll for updates (no WebSocket)
- **Contract-focused**: Limited classic Stellar data

## Horizon API (Legacy)

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

```typescript
// Stream transactions
const closeHandler = server
  .transactions()
  .forAccount(publicKey)
  .cursor("now")
  .stream({
    onmessage: (tx) => {
      console.log("New transaction:", tx.hash);
    },
    onerror: (error) => {
      console.error("Stream error:", error);
    },
  });

// Close stream when done
closeHandler();
```

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
const response = await rpc.sendTransaction(tx);
const result = await pollForResult(response.hash);
```

### Historical Data

```typescript
// Horizon - full history
const allTxs = await horizonServer
  .transactions()
  .forAccount(publicKey)
  .call();

// RPC - most methods limited to 7 days
// Exception: getLedgers can query back to genesis (Infinite Scroll)
// For full historical data, use:
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

For data older than 7 days (not available via most RPC methods; `getLedgers` can reach genesis via Infinite Scroll):

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

RPC "Infinite Scroll" is powered by the Stellar data lake — a cloud-based object store (SEP-0054 format):
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

> For a React/Next.js-specific setup, see [frontend-stellar-sdk.md](/.well-known/agent-skills/dapp/skill.md).
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

const configs: Record<string, NetworkConfig> = {
  mainnet: {
    rpcUrl: requireEnv("STELLAR_MAINNET_RPC_URL"),
    horizonUrl: "https://horizon.stellar.org",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    friendbotUrl: null,
  },
  testnet: {
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
    friendbotUrl: "https://friendbot.stellar.org",
  },
  local: {
    rpcUrl: "http://localhost:8000/soroban/rpc",
    horizonUrl: "http://localhost:8000",
    networkPassphrase: "Standalone Network ; February 2017",
    friendbotUrl: "http://localhost:8000/friendbot",
  },
};

const network = process.env.STELLAR_NETWORK || "testnet";
export const config = configs[network];

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
// RPC errors
try {
  const result = await rpc.sendTransaction(tx);
} catch (error) {
  if (error.code === 400) {
    // Invalid transaction
  } else if (error.code === 503) {
    // Service unavailable
  }
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
