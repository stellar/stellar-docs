---
name: agentic-payments
description: Agentic and machine-to-machine payments on Stellar. Covers x402 (HTTP 402 paid APIs via OZ Channels facilitator, fee-sponsored clients) and MPP (Machine Payments Protocol) in both Charge mode (per-request SAC) and Channel mode (off-chain commits, high-frequency). Defaults to USDC (SEP-41 SAC) on `stellar:testnet`/`stellar:pubnet` (CAIP-2). Use when selling a paid API to AI agents, building an x402 client, or designing a payment-channel architecture for high-frequency agent traffic.
user-invocable: true
argument-hint: "[payment task]"
---

# Agentic Payments: x402 + MPP

Two complementary protocols for AI-agent and machine-to-machine payments on Stellar. Pick based on who depends on whom and how often the agent pays.

## Quick decision

| | x402 | MPP Charge | MPP Channel |
|--|------|------------|-------------|
| Per-request on-chain tx? | Yes (via facilitator) | Yes (SAC) | No (off-chain commits) |
| Needs facilitator? | Yes (OZ Channels) | No | No |
| Client needs XLM? | No (fees sponsored) | Optional (`feePayer`) | Yes |
| Setup complexity | Low | Low | Medium (deploy contract first) |
| Best for | Quickest setup, fee-free clients | No third-party dep | High-frequency agents |

- Selling an API, want zero-XLM clients → see **x402 Seller** below
- Calling an x402 API from an agent → see **x402 Buyer** below
- Selling an API, no facilitator dependency → see **MPP Charge** below
- Agent making many requests per session → see **MPP Channel** below
- Unsure → x402 (lowest friction to get started)

All protocols use USDC (SEP-41 SAC) by default; `stellar:testnet` / `stellar:pubnet` CAIP-2 network IDs.

## Related skills
- The SACs the protocols call → `/.well-known/agent-skills/smart-contracts/skill.md`
- USDC and other classic assets → `/.well-known/agent-skills/assets/skill.md`
- Wallets and signing in the buyer client → `/.well-known/agent-skills/dapp/skill.md`
- RPC simulation / submission patterns → `/.well-known/agent-skills/data/skill.md`
- SEP-41 (token interface) and related standards → `/.well-known/agent-skills/standards/skill.md`

---

# Part 1: x402 — Paid APIs + Agent Buyer Clients


## When to use x402
x402 is the right choice when:
- You want the fastest path to a paid API — minimal code, no contract deployment
- You want clients (including AI agents) to pay with **zero XLM** — the OZ Channels facilitator sponsors all network fees
- You're building on top of an existing x402 ecosystem (Coinbase, other chains)

Trade-off: you depend on OZ Channels (or a self-hosted relayer) for verification and settlement. If you need zero third-party dependency, use MPP Charge (Part 2 below) instead.

## How x402 works on Stellar

```
Client → GET /resource                               → Server
Client ← 402 Payment Required (payment requirements) ← Server
Client builds SAC USDC transfer
Client signs auth entries only (not the full tx envelope)
Client → GET /resource + X-PAYMENT header           → Server
Server → OZ Channels /verify + /settle              → Stellar (~5s)
Client ← 200 OK + resource
```

The key Stellar difference: clients sign **auth entries**, not full transaction envelopes. The facilitator assembles the transaction, pays fees, and submits. Clients need zero XLM.

## Seller: monetize an Express API

```bash
npm install @x402/express @x402/core @x402/stellar express dotenv
npm pkg set type=module
```

```js
// server.js
import "dotenv/config";
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

// Drive the CAIP-2 network ID from one place. Switching to mainnet means
// flipping STELLAR_NETWORK and FACILITATOR_URL in .env, nothing in code.
const NETWORK = process.env.STELLAR_NETWORK || "stellar:testnet";

if (!process.env.OZ_API_KEY) {
  throw new Error(
    "OZ_API_KEY is required. Generate one at https://channels.openzeppelin.com/testnet/gen (testnet) or https://channels.openzeppelin.com/gen (mainnet)."
  );
}

const facilitator = new HTTPFacilitatorClient({
  url: process.env.FACILITATOR_URL ?? "https://channels.openzeppelin.com/x402/testnet",
  // OZ Channels requires Bearer auth on both testnet and mainnet
  createAuthHeaders: async () => {
    const h = { Authorization: `Bearer ${process.env.OZ_API_KEY}` };
    return { verify: h, settle: h, supported: h };
  },
});

const resourceServer = new x402ResourceServer(facilitator)
  .register(NETWORK, new ExactStellarScheme());

const app = express();

app.use(
  paymentMiddleware(
    {
      "GET /weather": {
        accepts: {
          scheme: "exact",
          price: "$0.001", // human-readable, auto-converts to 7-decimal USDC units
          network: NETWORK,
          payTo: process.env.STELLAR_RECIPIENT, // recipient G... account
        },
        description: "Current weather data",
      },
    },
    resourceServer
  )
);

app.get("/weather", (_req, res) => {
  res.json({ city: "San Francisco", temp: 18, conditions: "Foggy" });
});

app.listen(3001, () => console.log(`x402 server on http://localhost:3001 (${NETWORK})`));
```

**Env vars:**
- `STELLAR_NETWORK` — CAIP-2 network ID; defaults to `stellar:testnet`. Set to `stellar:pubnet` for mainnet.
- `STELLAR_RECIPIENT` — your G... address (receives USDC, needs a USDC trustline)
- `OZ_API_KEY` — OZ Channels API key (**required on both testnet and mainnet**; generate at the link in the runbook below)
- `FACILITATOR_URL` — defaults to testnet URL above; set to `https://channels.openzeppelin.com/x402` for mainnet

**Price format options:**
- `"$0.001"` — human-readable, auto-converts to 7-decimal USDC units
- `{ amount: "1000", asset: "ASSET_SAC_CONTRACT_ID" }` — explicit base units for non-USDC assets

**`payTo` is the recipient's classic Stellar account (`G...`), not the USDC SAC contract address.** Sending USDC lands in the classic balance of the `payTo` account, which is why that account also needs a USDC trustline. The SAC contract address is what the protocol invokes `transfer` on; see "Two USDC addresses" below.

## Buyer: agent client

```bash
npm install @x402/fetch @x402/stellar dotenv
npm pkg set type=module
```

```js
// client.js
import "dotenv/config";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";

const NETWORK = process.env.STELLAR_NETWORK || "stellar:testnet";

// createEd25519Signer takes the raw S... secret string and the CAIP-2 network ID.
// Do NOT pre-wrap with Keypair.fromSecret or call getNetworkPassphrase yourself —
// the signer does both internally.
const signer = createEd25519Signer(process.env.STELLAR_SECRET_KEY, NETWORK);

// wrapFetchWithPaymentFromConfig returns a fetch that handles 402 negotiation
// and auth-entry signing transparently.
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: NETWORK, client: new ExactStellarScheme(signer) }],
});

const res = await fetchWithPayment("http://localhost:3001/weather");
console.log(await res.json());
// Paid automatically: 402 negotiation + auth-entry signing under the hood
```

**Env vars:**
- `STELLAR_NETWORK` — CAIP-2 network ID; defaults to `stellar:testnet`. Must match the server's network.
- `STELLAR_SECRET_KEY` — your S... secret key (needs USDC trustline + balance)

**Browser frontends:** this client uses Node `fetch` and `createEd25519Signer`, both of which run in Node. A vanilla browser cannot sign contract auth entries through a typical wallet extension without additional glue. For a browser payer, run the x402 client server-side and expose a thin proxy endpoint to the page, or wire up Wallets-Kit / Varial with custom auth-entry signing.

## Testnet runbook

You need two Stellar testnet accounts: a **client/payer** (signs and pays from a USDC balance) and a **server/recipient** (the `payTo` in your route config). Both need a USDC trustline.

Two steps are web-only (Captcha or auth form) and cannot be scripted: the Circle USDC faucet and the OZ Channels key generator. Everything else can be automated. A complete `setup.js` sketch lives at the end of this section.

1. **Generate two keypairs**
   ```bash
   node -e "const { Keypair } = require('@stellar/stellar-sdk'); for (const n of ['RECIPIENT','PAYER']) { const k = Keypair.random(); console.log(n, k.publicKey(), k.secret()); }"
   ```

2. **Fund both with testnet XLM (friendbot)**
   ```bash
   curl "https://friendbot.stellar.org?addr=RECIPIENT_G..."
   curl "https://friendbot.stellar.org?addr=PAYER_G..."
   ```

3. **Add a USDC trustline to BOTH accounts** — open [Stellar Lab](https://lab.stellar.org/account/fund?network=test) and add a USDC trustline to each `G...`, or run via SDK for each keypair:
   ```js
   import * as StellarSdk from "@stellar/stellar-sdk";

   const horizon = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
   // Circle's classic USDC issuer on Stellar testnet
   const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

   async function addTrustline(secret) {
     const kp = StellarSdk.Keypair.fromSecret(secret);
     const acc = await horizon.loadAccount(kp.publicKey());
     const tx = new StellarSdk.TransactionBuilder(acc, {
       fee: StellarSdk.BASE_FEE,
       networkPassphrase: StellarSdk.Networks.TESTNET,
     })
       .addOperation(StellarSdk.Operation.changeTrust({
         asset: new StellarSdk.Asset("USDC", USDC_ISSUER),
       }))
       .setTimeout(60)
       .build();
     tx.sign(kp);
     return horizon.submitTransaction(tx);
   }

   // Repeat for both the recipient secret and the payer secret.
   await addTrustline(process.env.RECIPIENT_SECRET);
   await addTrustline(process.env.PAYER_SECRET);
   ```

   Without a trustline on the recipient, the SAC `transfer` settles into nothing and the request fails with `op_no_trust`.

4. **Fund the PAYER with testnet USDC** — open the [Circle testnet faucet](https://faucet.circle.com/), select **Stellar testnet**, paste the payer's `G...`. Web Captcha; no API.

5. **Generate an OZ Channels testnet API key** ([channels.openzeppelin.com/testnet/gen](https://channels.openzeppelin.com/testnet/gen)). **Required, not optional.** Without it the server crashes at startup with `Failed to initialize: no supported payment kinds loaded from any facilitator`.

6. **Fill in `.env`**
   ```
   STELLAR_NETWORK=stellar:testnet
   STELLAR_RECIPIENT=G... (recipient public key)
   STELLAR_SECRET_KEY=S... (payer secret key)
   OZ_API_KEY=...
   ```

7. **Run it**
   ```bash
   node server.js
   # in another terminal
   node client.js
   ```

### Optional: setup.js to automate steps 1–3

Drop this in your project and run once. It generates keys, friendbots, and adds USDC trustlines, then writes a starter `.env` so you only need to do the two manual web steps afterward.

```js
// setup.js
import fs from "fs/promises";
import {
  Keypair, Horizon, Networks, TransactionBuilder, Operation, Asset, BASE_FEE,
} from "@stellar/stellar-sdk";

const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");

const friendbot = (addr) => fetch(`https://friendbot.stellar.org?addr=${addr}`);

async function addTrustline(kp) {
  const acc = await horizon.loadAccount(kp.publicKey());
  const tx = new TransactionBuilder(acc, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.changeTrust({ asset: new Asset("USDC", USDC_ISSUER) }))
    .setTimeout(60).build();
  tx.sign(kp);
  return horizon.submitTransaction(tx);
}

const recipient = Keypair.random();
const payer = Keypair.random();
await Promise.all([friendbot(recipient.publicKey()), friendbot(payer.publicKey())]);
await new Promise(r => setTimeout(r, 2000));
await Promise.all([addTrustline(recipient), addTrustline(payer)]);

await fs.writeFile(".env", `STELLAR_RECIPIENT=${recipient.publicKey()}
STELLAR_SECRET_KEY=${payer.secret()}
OZ_API_KEY=
`);

console.log(`Fund payer with USDC: https://faucet.circle.com  →  ${payer.publicKey()}`);
console.log(`Get OZ key:          https://channels.openzeppelin.com/testnet/gen  →  paste into OZ_API_KEY`);
```

## Two USDC addresses (don't confuse them)

USDC on Stellar has two addresses, used in different places. Mixing them up is a common stumble.

| Address | Format | Used for |
|---------|--------|----------|
| Classic asset issuer | `G...` (32-byte ed25519 public key) | The `issuer` of the classic USDC asset; used when adding a trustline (`new Asset("USDC", G...)`) |
| SAC (Stellar Asset Contract) | `C...` (32-byte contract address) | The contract the protocol invokes `transfer` on; used in payment requirements |

Use the exported constants instead of hard-coding when possible:

```js
import { USDC_TESTNET_ADDRESS, USDC_PUBNET_ADDRESS } from "@x402/stellar";
// USDC_TESTNET_ADDRESS = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
// USDC_PUBNET_ADDRESS  = "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75"
```

`payTo` in your route config is always a classic recipient account (`G...`). The SAC address only appears if you set a custom `asset` in the price config for a non-USDC token.

## Mainnet checklist

| Config | Value |
|--------|-------|
| Network ID | `stellar:pubnet` |
| RPC URL | Provider-specific endpoint (see [Stellar RPC providers directory](https://developers.stellar.org/docs/data/apis/rpc/providers)) |
| Facilitator URL | `https://channels.openzeppelin.com/x402` |
| USDC SAC | `USDC_PUBNET_ADDRESS` from `@x402/stellar` (currently `CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75`) |
| OZ Channels API key | Required ([channels.openzeppelin.com/gen](https://channels.openzeppelin.com/gen)) |
| Funding | Real USDC on mainnet (CEX, DEX, or bridge) |

Always test on testnet first. To switch a working setup to mainnet, change only the `.env` (`STELLAR_NETWORK=stellar:pubnet`, `FACILITATOR_URL=https://channels.openzeppelin.com/x402`, mainnet `OZ_API_KEY`, and a mainnet `STELLAR_RECIPIENT`); the samples derive their network from `STELLAR_NETWORK`, so no code changes are needed. Both networks require an OZ Channels API key in the `Authorization: Bearer` header.

## Key concepts

**Auth entry signing** — On Stellar, x402 clients sign contract authorization entries, not full transaction envelopes. The facilitator assembles the complete transaction. This is lighter than EVM/Solana signing, and means clients never need to manage sequence numbers or pay fees.

**Fee sponsorship** — OZ Channels pays all Stellar network fees (~$0.00001/tx). Clients need a funded wallet with USDC but zero XLM.

**`exact-v2` scheme** — The Stellar x402 scheme version. Server advertises `scheme: "exact"` + `x402Version: 2`. Don't mix v1 and v2 packages.

**SAC (Stellar Asset Contract)** — USDC on Stellar is a classic asset wrapped in a smart contract. x402 payments invoke `transfer` on the SAC. Any SEP-41 token works; USDC is the default.

**Ledger expiration** — Auth entries include a `max_ledger` bound. Use `latestLedger + 12` (~1 minute at 5s/ledger). Expired entries fail at settlement.

**CAIP-2 network IDs** — `stellar:testnet` and `stellar:pubnet`. These are the exact strings the protocol expects.

## Common pitfalls

**Auth entry expired on settle**
- Symptom: facilitator returns `isValid: false`, error mentions ledger expiration
- Fix: ensure client uses `latestLedger + 12` (or higher) as expiration; don't cache auth entries across requests

**Wrong USDC decimal precision**
- Symptom: payment amount off by 10x or 100x
- Fix: Stellar USDC uses **7 decimal places** (not 6 like EVM USDC). `$0.001` = `10000` in base units.

**V1/V2 package mismatch**
- Symptom: TypeScript errors or silent payment failures
- Fix: use all `@x402/*` packages at the same major version. V2 is multi-chain; don't import V1 `@x402/core` alongside V2 `@x402/stellar`.

**Missing USDC trustline**
- Symptom: `op_no_trust` error during settlement
- Fix: add a USDC `changeTrust` operation before attempting any x402 payment (see testnet runbook above)

**OZ Channels 401 on testnet or mainnet**
- Symptom: facilitator rejects with 401, server logs `Failed to initialize: no supported payment kinds loaded from any facilitator`
- Fix: an API key is required on **both** networks (this is a recent change). Generate one at [channels.openzeppelin.com/testnet/gen](https://channels.openzeppelin.com/testnet/gen) (testnet) or [channels.openzeppelin.com/gen](https://channels.openzeppelin.com/gen) (mainnet), then set `OZ_API_KEY` and pass it via `createAuthHeaders` (see the Seller example).

**Trustline missing on the recipient**
- Symptom: `op_no_trust` during settlement, even though the client has USDC
- Fix: the `payTo` account needs a USDC trustline too. The SAC `transfer` settles the underlying classic asset, which the recipient cannot hold without a trustline. Add `changeTrust` to both accounts during setup.

**Trying to sign auth entries from a browser**
- Symptom: bundling errors, or a browser wallet that has no API to sign contract auth entries
- Fix: run the x402 client server-side (e.g. an Express route the browser calls), or use Wallets-Kit / Varial with custom auth-entry signing. `@x402/fetch` + `createEd25519Signer` target Node and assume a raw secret key.

**Passing a `Keypair` (or a network passphrase) to `createEd25519Signer`**
- Symptom: `TypeError: encoded argument must be of type String`, or `Error: Unknown Stellar network: Test SDF Network ; September 2015`
- Fix: the signer takes the raw `S...` secret string and a CAIP-2 network ID. Do **not** wrap with `Keypair.fromSecret` first, and do **not** pre-convert with `getNetworkPassphrase` — both are done internally.
  ```js
  // wrong
  const signer = createEd25519Signer(Keypair.fromSecret(s), getNetworkPassphrase("stellar:testnet"));
  // right
  const signer = createEd25519Signer(s, "stellar:testnet");
  ```

---

# Part 2: MPP — Machine Payments Protocol (Charge + Channel)


## When to use MPP
MPP is the right choice when:
- You want **no facilitator dependency** — payments settle directly on Stellar via SAC transfers
- Your AI agent makes **many requests per session** — use channel mode to pay off-chain and settle once
- You're building a Stellar-native payment stack without relying on third-party infrastructure

Two modes:

| Mode | On-chain txs | Best for |
|------|-------------|----------|
| **Charge** | One per request | Per-request payments, no pre-funding required |
| **Channel** | One deposit + one close | High-frequency agents (100s of requests/session) |

If you need zero-XLM clients or the simplest possible setup, use x402 (Part 1 above) instead.

## Charge mode: per-request payments

Each request triggers a SAC token transfer settled on-chain. No facilitator. Server can optionally sponsor fees so clients don't need XLM.

```bash
npm install express @stellar/mpp mppx @stellar/stellar-sdk dotenv
npm pkg set type=module
```

**Server:**

```js
// charge-server.js
import express from "express";
import { Mppx } from "mppx";
import * as stellar from "@stellar/mpp/charge/server";
import * as StellarSdk from "@stellar/stellar-sdk";

const USDC_SAC_TESTNET = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";
const RECIPIENT = process.env.STELLAR_RECIPIENT; // G... address

const mppx = Mppx.create({
  secretKey: process.env.MPP_SECRET_KEY, // shared secret for credential verification
  methods: [
    stellar.charge({
      recipient: RECIPIENT,
      currency: USDC_SAC_TESTNET,
      network: "stellar:testnet",
      // optional: server pays network fees so clients don't need XLM
      feePayer: process.env.FEE_PAYER_SECRET
        ? { envelopeSigner: StellarSdk.Keypair.fromSecret(process.env.FEE_PAYER_SECRET) }
        : undefined,
    }),
  ],
});

const app = express();
app.use(express.json());

// mppx middleware: returns 402 with challenge, then validates payment on retry
app.use(mppx.middleware());

app.get("/data", (req, res) => {
  res.json({ result: "paid content", price: "$0.001 USDC" });
});

app.listen(3002, () => console.log("MPP charge server on http://localhost:3002"));
```

**Client:**

```js
// charge-client.js
import { Mppx } from "mppx";
import * as stellar from "@stellar/mpp/charge/client";
import * as StellarSdk from "@stellar/stellar-sdk";

const keypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_SECRET_KEY);

const mppx = Mppx.create({
  methods: [
    stellar.charge({
      keypair,
      mode: "pull", // server assembles and broadcasts the transaction
      onProgress(event) {
        // event.type: "challenge" | "signed" | "settled"
        if (event.type === "settled") console.log("Settled:", event.txHash);
      },
    }),
  ],
});

// mppx wraps fetch — 402 handling is transparent
const res = await mppx.fetch("http://localhost:3002/data");
console.log(await res.json());
```

**Env vars (server):** `STELLAR_RECIPIENT`, `MPP_SECRET_KEY`, `FEE_PAYER_SECRET` (optional)
**Env vars (client):** `STELLAR_SECRET_KEY`

**`mode: "pull"` vs `"push"`:**
- `"pull"` — client signs auth entries, server assembles + broadcasts (default; use with `feePayer`)
- `"push"` — client builds and broadcasts the transaction directly (client must have XLM for fees)

## Channel mode: high-frequency off-chain payments

The client deploys a one-way payment channel contract, deposits USDC once, then signs **cumulative commitments** off-chain for each request. No transaction per request — only two on-chain txs total (deposit + close). Ideal for AI agents making hundreds of calls in a session.

### Channel lifecycle

```
1. Deploy channel contract (one-time)   → C... contract address
2. Client deposits USDC into channel    → on-chain tx
3. Per request: client signs commitment → off-chain (just a signature)
   Amount is cumulative: each sig covers all previous payments + this one
4. Server closes channel when done      → on-chain tx, settles total
```

### Prerequisites

- Deploy a one-way-channel smart contract to get a `C...` contract address
- Generate an ed25519 keypair for commitment signing (see [stellar-mpp SDK](https://github.com/stellar/stellar-mpp-sdk))
- Fund the channel with USDC before making requests

### Server:

```js
// channel-server.js
import express from "express";
import { Mppx, Store } from "mppx";
import * as stellar from "@stellar/mpp/channel/server";

const mppx = Mppx.create({
  secretKey: process.env.MPP_SECRET_KEY,
  methods: [
    stellar.channel({
      channel: process.env.CHANNEL_CONTRACT,       // C... contract address
      commitmentKey: process.env.COMMITMENT_PUBKEY, // 64-char hex ed25519 public key
      store: Store.memory(), // dev only — use persistent store in production
      network: "stellar:testnet",
    }),
  ],
});

const app = express();
app.use(express.json());
app.use(mppx.middleware());

app.get("/data", (req, res) => {
  res.json({ result: "paid content" });
});

app.listen(3003);
```

### Client:

```js
// channel-client.js
import { Mppx } from "mppx";
import * as stellar from "@stellar/mpp/channel/client";
import * as StellarSdk from "@stellar/stellar-sdk";

// commitment key must be a raw ed25519 seed — NOT a standard Stellar secret key
const commitmentKey = StellarSdk.Keypair.fromRawEd25519Seed(
  Buffer.from(process.env.COMMITMENT_SECRET, "hex") // 64-char hex secret
);

const mppx = Mppx.create({
  methods: [
    stellar.channel({
      commitmentKey,
      onProgress(event) {
        // event.type: "challenge" | "signed"
      },
    }),
  ],
});

// Make many requests — each signs a cumulative off-chain commitment
for (let i = 0; i < 100; i++) {
  const res = await mppx.fetch("http://localhost:3003/data");
  console.log(i, await res.json());
}
```

### Closing the channel (server-initiated):

```js
import { close } from "@stellar/mpp/channel/server";
import * as StellarSdk from "@stellar/stellar-sdk";

const txHash = await close({
  channel: process.env.CHANNEL_CONTRACT,
  amount: lastCumulativeAmount, // bigint, total USDC owed in base units
  signature: lastCommitmentSignature, // hex string from final commitment
  feePayer: { envelopeSigner: StellarSdk.Keypair.fromSecret(process.env.FEE_PAYER_SECRET) },
  network: "stellar:testnet",
});
// Single on-chain transaction settles the full session
console.log("Channel closed:", txHash);
```

**Env vars (server):** `CHANNEL_CONTRACT`, `COMMITMENT_PUBKEY`, `MPP_SECRET_KEY`, `FEE_PAYER_SECRET`
**Env vars (client):** `COMMITMENT_SECRET`

## Packages and subpath imports

```bash
npm install @stellar/mpp mppx @stellar/stellar-sdk
```

| Import path | Recommended import pattern |
|-------------|----------------------------|
| `@stellar/mpp/charge/server` | `import * as stellar from "@stellar/mpp/charge/server"` — use `stellar.charge(...)` |
| `@stellar/mpp/charge/client` | `import * as stellar from "@stellar/mpp/charge/client"` — use `stellar.charge(...)` |
| `@stellar/mpp/channel/server` | `import * as stellar from "@stellar/mpp/channel/server"` — use `stellar.channel(...)`, `stellar.close(...)`, `stellar.getChannelState(...)`, `stellar.watchChannel(...)` |
| `@stellar/mpp/channel/client` | `import * as stellar from "@stellar/mpp/channel/client"` — use `stellar.channel(...)` |
| `@stellar/mpp/channel` | Zod schema definitions for channel types |
| `mppx` | `import { Mppx, Store } from "mppx"` |

## Testnet runbook

**Steps shared with all protocols:**
1. Generate keypair + fund with Friendbot (see x402 testnet runbook in Part 1 above)
2. Add USDC trustline
3. Get testnet USDC from [Circle faucet](https://faucet.circle.com/)

**Channel mode only:**
4. Deploy the one-way-channel contract (see [stellar-mpp-sdk](https://github.com/stellar/stellar-mpp-sdk) for deploy script)
5. Generate a 64-char hex ed25519 seed for the commitment key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. Derive the public key and fund the channel with USDC before making requests

## Common pitfalls

**Channel: wrong commitment key format**
- Symptom: `Keypair.fromRawEd25519Seed` throws or signatures fail to verify
- Fix: the commitment key is a raw ed25519 seed as a 64-char hex string — not a Stellar `S...` secret key. Generate with `crypto.randomBytes(32).toString('hex')`.

**Channel: non-cumulative amounts**
- Symptom: server rejects commitments after the first request
- Fix: each commitment's `amount` must be the **running total** of all payments so far, not just the price of the current request. The server tracks the highest-seen commitment.

**Channel: deposit TTL expired**
- Symptom: `close()` fails or channel appears drained
- Fix: Contract storage has a TTL. Close the channel before it expires, or extend storage TTL via `bumpContractInstance`. Don't leave channels open indefinitely.

**Charge: client has no XLM for fees**
- Symptom: `op_insufficient_balance` or fee errors on client-submitted transactions
- Fix: set `mode: "pull"` on the client and configure `feePayer` on the server so the server pays fees. The client only signs auth entries.

**`Store.memory()` in production**
- Symptom: server loses track of channel state on restart, enables double-spend
- Fix: replace `Store.memory()` with a persistent store (database-backed) before going to production.
