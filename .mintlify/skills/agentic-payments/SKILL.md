---
name: agentic-payments
description: Agentic and machine-to-machine payments on Stellar. Covers x402 (HTTP 402 paid APIs through a facilitator, fee-sponsored clients; the guide configures OZ Channels) and MPP (Machine Payments Protocol) in both Charge mode (per-request SAC) and Session mode (channel-backed off-chain commits, high-frequency; formerly called Channel mode). Defaults to USDC (SEP-41 SAC) on `stellar:testnet`/`stellar:pubnet` (CAIP-2). Use when selling a paid API to AI agents, building an x402 client, or designing a payment-channel architecture for high-frequency agent traffic.
user-invocable: true
argument-hint: "[payment task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Agentic Payments: x402 + MPP

Two complementary protocols for AI-agent and machine-to-machine payments on Stellar. Pick based on who depends on whom and how often the agent pays.

## Quick decision

| | x402 | MPP Charge | MPP Session |
|--|------|------------|-------------|
| Per-request on-chain tx? | Yes (via facilitator) | Yes (SAC) | No (off-chain commits) |
| Needs facilitator? | Yes — hosted or your own ([options](#facilitator-options)) | No | No |
| Client needs XLM? | No (fees sponsored) | Optional (`feePayer`) | Yes |
| Setup complexity | Low | Low | Medium (deploy contract first) |
| Best for | Quickest setup, fee-free clients | No third-party dep | High-frequency agents |

- Selling an API, want zero-XLM clients → **x402 Seller** in [x402 — Paid APIs + Agent Buyer Clients](#x402--paid-apis--agent-buyer-clients)
- Calling an x402 API from an agent → **x402 Buyer** in [x402 — Paid APIs + Agent Buyer Clients](#x402--paid-apis--agent-buyer-clients)
- Selling an API, no facilitator dependency → **Charge mode** in [MPP — Machine Payments Protocol (Charge + Session)](#mpp--machine-payments-protocol-charge--session)
- Agent making many requests per session → **Session mode** in [MPP — Machine Payments Protocol (Charge + Session)](#mpp--machine-payments-protocol-charge--session)
- Sold an API, now want agents to find it → **Discovery** in [mpp.md](#discovery-let-agents-find-your-paid-api)
- Unsure → x402 (lowest friction to get started)

All protocols use USDC (SEP-41 SAC) by default; `stellar:testnet` / `stellar:pubnet` CAIP-2 network IDs.

## Read the file that matches the task

This file carries the decision table, the shared testnet account setup, and the USDC address reference. The protocol playbooks live alongside it:

| Task | Section |
|------|------|
| Sell a paid API via a facilitator (zero-XLM clients), build an x402 buyer agent | [x402 — Paid APIs + Agent Buyer Clients](#x402--paid-apis--agent-buyer-clients) |
| Facilitator-free per-request payments (Charge) or channel-backed sessions (Session) | [MPP — Machine Payments Protocol (Charge + Session)](#mpp--machine-payments-protocol-charge--session) |
| Publish an OpenAPI discovery document so agents find your paid API | [Discovery](#discovery-let-agents-find-your-paid-api) |
| Create/fund testnet accounts, add USDC trustlines, get testnet USDC | [Testnet setup](#testnet-setup-shared) (below) |
| Which USDC address goes where (classic issuer vs SAC) | [Two USDC addresses](#two-usdc-addresses-dont-confuse-them) (below) |

## Related skills
- The SACs the protocols call → `/.well-known/agent-skills/smart-contracts/skill.md`
- USDC and other classic assets → `/.well-known/agent-skills/assets/skill.md`
- Wallets and signing in the buyer client → `/.well-known/agent-skills/dapp/skill.md`
- RPC simulation / submission patterns → `/.well-known/agent-skills/data/skill.md`
- SEP-41 (token interface) and related standards → `/.well-known/agent-skills/standards/skill.md`


## Testnet setup (shared)

Both protocols need the same base setup: a **client/payer** account (signs and pays from a USDC balance) and a **server/recipient** account. Both need a USDC trustline.

One step of this shared setup is web-only (Captcha) and cannot be scripted: the Circle USDC faucet. The rest of it can be automated — [x402 — Paid APIs + Agent Buyer Clients](#x402--paid-apis--agent-buyer-clients) ships a `setup.js` that does steps 1–3 and writes a starter `.env`. (Outside this setup, the OZ Channels facilitator that x402.md configures has its own web-only key generator. Each facilitator sets its own auth requirement — the x402.org one needs none — and MPP needs no third party at all.)

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

x402's `payTo` route config and MPP's `recipient` are always a classic account (`G...`). The SAC address only appears where the config names the settlement asset (x402's custom `asset` price config, MPP's `currency`).

---

# x402 — Paid APIs + Agent Buyer Clients

Sell paid APIs to AI agents and build agent buyer clients over HTTP 402, settled in USDC through an x402 facilitator. This guide configures the OpenZeppelin Channels facilitator; [Facilitator options](#facilitator-options) below lists the alternatives. Companion to [SKILL.md](#agentic-payments-x402--mpp) (decision table, shared testnet setup, USDC addresses); the facilitator-free alternative lives in [MPP — Machine Payments Protocol (Charge + Session)](#mpp--machine-payments-protocol-charge--session).

## When to use x402
x402 is the right choice when:
- You want the fastest path to a paid API — minimal code, no contract deployment
- You want clients (including AI agents) to pay with **zero XLM** — a hosted facilitator sponsors the network fees (OZ Channels on both networks, the x402.org facilitator on testnet)
- You're building on top of an existing x402 ecosystem (Coinbase, other chains)

Trade-off: you depend on a facilitator for verification and settlement, and each hosted one is its own third party. If you need zero third-party dependency, either self-facilitate in your own process ([Facilitator options](#facilitator-options)) or use MPP Charge ([MPP — Machine Payments Protocol (Charge + Session)](#mpp--machine-payments-protocol-charge--session)) instead.

## How x402 works on Stellar

```
Client → GET /resource                               → Server
Client ← 402 Payment Required (payment requirements) ← Server
Client builds SAC USDC transfer
Client signs auth entries only (not the full tx envelope)
Client → GET /resource + X-PAYMENT header           → Server
Server → facilitator /verify + /settle              → Stellar (~5s)
Client ← 200 OK + resource
```

The key Stellar difference: clients sign **auth entries**, not full transaction envelopes. The facilitator assembles the transaction, pays fees, and submits. Clients need zero XLM.

## Facilitator options

x402 is permissionless — anyone can run a facilitator, and the protocol itself never requires an API key. Pick the facilitator before you write the server:

- **OZ Channels** (`https://channels.openzeppelin.com/x402/testnet`, `https://channels.openzeppelin.com/x402`) — testnet and mainnet, API key required on both. Stellar's docs list it as the *Build on Stellar Relayer* with the OpenZeppelin x402 plugin. **This guide configures it**, and it is the mainnet facilitator those docs name.
- **The x402.org facilitator** (`https://x402.org/facilitator`, also `@x402/core`'s `DEFAULT_FACILITATOR_URL`) — testnet only, no API key. Stellar's docs call it the Coinbase x402 facilitator. Its `/supported` response advertises `stellar:testnet` with sponsored fees and carries no `stellar:pubnet` entry.
- **AgentSmith Facilitator** (`https://testnet.agentsmith.xyz/facilitator`, `https://mainnet.agentsmith.xyz/facilitator`) — testnet and mainnet, no API key required on testnet; mainnet requires a Resource Server API key, which the mainnet `/supported` check also needs. Sponsors XLM fees on both networks. Supports `exact` and experimental `upto` schemes. Docs: [agentsmith.xyz/docs.html](https://agentsmith.xyz/docs.html).
- **Your own** — run a facilitator, or facilitate in process. The [self-facilitation example](https://github.com/x402-foundation/x402/tree/main/examples/typescript/servers/self-facilitation) shows the shape, an `x402Facilitator` from `@x402/core/facilitator` wired into `x402ResourceServer`, but it registers the EVM scheme on Base Sepolia. On Stellar you register `ExactStellarScheme` from `@x402/stellar/exact/facilitator`, built with the `FacilitatorStellarSigner` it settles from (`createEd25519Signer` on that account's `S...` key). That account submits the transaction and pays the XLM fees, so there is no third party and no external fee sponsor.

`GET <facilitator-url>/supported` is the authoritative check for whether an operator serves your network. The full lists live on [x402's facilitators page](https://docs.x402.org/dev-tools/facilitators) and in the [x402 Facilitators section](https://developers.stellar.org/docs/build/agentic-payments/x402#x402-facilitators) of Stellar's docs.

## Seller: monetize an Express API

```bash
npm install @x402/express @x402/core @x402/stellar @stellar/stellar-sdk express dotenv
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

// OZ Channels is this example's facilitator, and it is the key's owner:
// the API key is that provider's requirement, not x402's. Drop this check
// and createAuthHeaders below if you point FACILITATOR_URL at a
// facilitator that needs no auth.
if (!process.env.OZ_API_KEY) {
  throw new Error(
    "OZ_API_KEY is required by the OZ Channels facilitator. Generate one at https://channels.openzeppelin.com/testnet/gen (testnet) or https://channels.openzeppelin.com/gen (mainnet)."
  );
}

const facilitator = new HTTPFacilitatorClient({
  url: process.env.FACILITATOR_URL || "https://channels.openzeppelin.com/x402/testnet",
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
- `OZ_API_KEY` — OZ Channels API key (**that facilitator requires it on both testnet and mainnet**; generate at the link in the runbook below). Another facilitator brings its own auth, or none.
- `FACILITATOR_URL` — defaults to the OZ Channels testnet URL above; set to `https://channels.openzeppelin.com/x402` for mainnet

**Price format options:**
- `"$0.001"` — human-readable, auto-converts to 7-decimal USDC units
- `{ amount: "1000", asset: "ASSET_SAC_CONTRACT_ID" }` — explicit base units for non-USDC assets

**`payTo` is the recipient's classic Stellar account (`G...`), not the USDC SAC contract address.** Sending USDC lands in the classic balance of the `payTo` account, which is why that account also needs a USDC trustline. The SAC contract address is what the protocol invokes `transfer` on; see [Two USDC addresses](#two-usdc-addresses-dont-confuse-them) in the router.

## Pricing multiple routes with `paymentMiddlewareFromConfig`

The seller example above prices a single route through `paymentMiddleware`
and `x402ResourceServer`. For more than one paid route, `@x402/express` also
exports `paymentMiddlewareFromConfig`, which takes the same route-keyed
object directly — no `x402ResourceServer` wrapper, but you assemble the
facilitator client and scheme registration yourself:

```js
import { paymentMiddlewareFromConfig } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { Keypair, StrKey } from "@stellar/stellar-sdk";

const facilitator = new HTTPFacilitatorClient({
  // @x402/core falls back to its own DEFAULT_FACILITATOR_URL
  // ("https://x402.org/facilitator") when this is unset. That facilitator
  // does support stellar:testnet, so the failure isn't "wrong chain" — it's
  // two others: createAuthHeaders below sends the OZ_API_KEY Bearer token
  // to whichever URL ends up here, so an unset env var silently leaks that
  // credential to an unrelated operator; and x402.org has no stellar:pubnet
  // entry at all, so the exact same unset-env-var mistake in a mainnet
  // deployment fails differently and more confusingly than in testnet. Set
  // the default explicitly instead of relying on that silent fallback.
  url: process.env.FACILITATOR_URL || "https://channels.openzeppelin.com/x402/testnet",
  createAuthHeaders: async () => {
    const h = { Authorization: `Bearer ${process.env.OZ_API_KEY}` };
    return { verify: h, settle: h, supported: h };
  },
});

// Same resolveRecipient() as mpp.md's Recipient resolution pattern, not
// just a cross-reference to it in prose — payTo below lands unvalidated
// in the 402 response body for every unauthenticated caller to see, and
// an unrejected malformed value would either leak a pasted secret key
// there or get handed to paymentMiddlewareFromConfig() instead of
// tripping the fail-closed fallback further down.
function resolveRecipient() {
  let raw = (process.env.STELLAR_RECIPIENT || "").trim().replace(/['"]/g, "");
  if (!raw) return "";

  if (raw.startsWith("S")) {
    try {
      const pub = Keypair.fromSecret(raw).publicKey();
      console.warn(`STELLAR_RECIPIENT is a secret key — derived public key: ${pub.slice(0, 8)}...`);
      return pub;
    } catch {
      console.error("STELLAR_RECIPIENT looks like a secret key but failed to parse — disabling x402");
      return "";
    }
  }

  if (!StrKey.isValidEd25519PublicKey(raw)) {
    console.error(`STELLAR_RECIPIENT is not a valid Stellar public key — disabling x402: ${raw.slice(0, 8)}...`);
    return "";
  }

  return raw;
}

const PAY_TO = resolveRecipient();

const PAID_ROUTES = {
  "GET /signals": {
    accepts: { scheme: "exact", price: "$0.02", network: NETWORK, payTo: PAY_TO },
    description: "Live market signals",
  },
  "GET /market": {
    accepts: { scheme: "exact", price: "$0.05", network: NETWORK, payTo: PAY_TO },
    description: "Enriched market state",
  },
  "POST /execute": {
    accepts: { scheme: "exact", price: "$0.25", network: NETWORK, payTo: PAY_TO },
    description: "Run a strategy",
  },
};

// Fails closed, not open: initialize the real middleware only when PAY_TO
// is set. Same rule as mpp.md's charge/channel middleware: a paid
// production path degrades loudly, never silently.
//
// Don't try to replicate @x402/core's own route matching here to decide
// which unconfigured requests deserve a 503. getRouteConfig() uppercases
// the method and normalizes the path — ordinary percent-encoding gets
// decoded (GET /%73ignals matches the same route as GET /signals),
// collapses duplicate slashes, and strips a trailing slash — before
// matching case-insensitively against each route's compiled regex. (A
// literal %2f or %5c is deliberately left encoded rather than decoded
// into an actual slash or backslash, so it can never be mistaken for a
// real path separator — the opposite of the ordinary-character case.)
// Beyond literal paths like the ones above, a key can also be a wildcard
// (*), a named parameter (:city), or a bracket parameter ([id]), each
// compiled to its own regex at startup. A hand-written check that tries
// to mirror all of that is exactly the kind of security-relevant logic
// that's easy to get subtly wrong (a case or encoding variant slips
// through free) and hard to keep in sync as routes change. Mount this
// middleware under its own path instead, and make the unconfigured
// fallback unconditional: every request that reaches it is, by
// construction, part of the paid API.
let x402Middleware;
if (PAY_TO) {
  x402Middleware = paymentMiddlewareFromConfig(
    PAID_ROUTES,
    facilitator,
    [{ network: NETWORK, server: new ExactStellarScheme() }],
    { appName: "My API", testnet: NETWORK === "stellar:testnet" },
  );
} else {
  console.warn("STELLAR_RECIPIENT missing or invalid — paid routes return 503 instead of pricing");
  x402Middleware = (req, res) => {
    res.status(503).json({ error: "x402 payment middleware unavailable — STELLAR_RECIPIENT missing or invalid" });
  };
}

// Mounted under /paid rather than at the app root, so the unconfigured
// fallback above never has to decide which requests it applies to — it's
// unconditional 503 for everything reaching it, configured or not. That
// "every request under /paid is paid" framing holds only while every
// handler you register under this prefix has a matching key in
// PAID_ROUTES; a handler added under /paid without one still falls
// through to next() unpriced once PAY_TO *is* configured (unchanged
// library behavior, see below) — it's just never free by accident during
// the specific failure this pattern guards against.
app.use("/paid", x402Middleware);

// Route handlers move under /paid too — this is the part that actually
// matters. A handler left registered at the old top-level app.get("/signals", ...)
// never passes through x402Middleware at all and serves its content free,
// with or without PAY_TO configured. Copying only the middleware mount
// above without moving the handlers reintroduces the exact bug this
// pattern exists to close.
app.get("/paid/signals", (req, res) => {
  res.json({ result: "live market signals" });
});
app.get("/paid/market", (req, res) => {
  res.json({ result: "enriched market state" });
});
app.post("/paid/execute", (req, res) => {
  res.json({ result: "strategy executed" });
});
```

Each key is `"METHOD /path"`, relative to the `/paid` mount point above
(so `"GET /signals"` answers `GET /paid/signals`); a request under `/paid`
that doesn't match any key still falls through to `next()` unpriced when
`PAY_TO` is set — that part is unchanged.

**Recover at boot, fail closed per request, when the recipient isn't
configured.** A server that throws at boot because `STELLAR_RECIPIENT` is
unset breaks CI and any environment that hasn't provisioned secrets yet —
that part should never throw. But once the server is up, a paid route
must never respond with its normal, unpriced 200 just because payment
enforcement couldn't be set up; that's a silent free tier no one decided
to offer, which is what the `if (PAY_TO)` guard above does: mount the
payment gate under its own path prefix, and respond `503` unconditionally
for everything under it when unconfigured, rather than trying to decide
per-request which paths would have been charged. See
[Recipient resolution](#recipient-resolution-recover-at-boot-fail-closed-per-request)
in mpp.md for the fuller pattern this borrows from — recovering a secret
key pasted in the wrong env var, and rejecting a malformed `G...` instead
of letting it throw deep in the SDK.

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

First complete the [shared testnet setup in SKILL.md](#testnet-setup-shared) — keypairs, XLM funding, USDC trustlines on **both** accounts, and testnet USDC from the Circle faucet (or run `setup.js` below). Then:

1. **Generate an OZ Channels testnet API key** ([channels.openzeppelin.com/testnet/gen](https://channels.openzeppelin.com/testnet/gen)). **This facilitator requires it, on testnet as well as mainnet.** With the key unset, the seller example's own guard throws `OZ_API_KEY is required by the OZ Channels facilitator` before the resource server starts. With a wrong or revoked key, the guard passes and startup fails later with `Failed to initialize: no supported payment kinds loaded from any facilitator` — the 401 path in [Common pitfalls](#common-pitfalls). A facilitator that needs no key skips this step — see [Facilitator options](#facilitator-options).

2. **Fill in `.env`**
   ```
   STELLAR_NETWORK=stellar:testnet
   STELLAR_RECIPIENT=G... (recipient public key)
   STELLAR_SECRET_KEY=S... (payer secret key)
   OZ_API_KEY=...
   ```

3. **Run it**
   ```bash
   node server.js
   # in another terminal
   node client.js
   ```

### Optional: setup.js to automate the shared setup

Drop this in your project and run once. It generates keys, friendbots, and adds USDC trustlines (the shared setup steps 1–3), then writes a starter `.env` so you only need to do the two manual web steps afterward.

```js
// setup.js
import fs from "fs/promises";
import {
  Keypair, Horizon, Networks, TransactionBuilder, Operation, Asset, BASE_FEE, rpc,
} from "@stellar/stellar-sdk";

const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org");

// fundAddress throws if Friendbot does not fund the account
const friendbot = (addr) => rpcServer.fundAddress(addr);

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

## Mainnet checklist

| Config | Value |
|--------|-------|
| Network ID | `stellar:pubnet` |
| RPC URL | Provider-specific endpoint (see [Stellar RPC providers directory](https://developers.stellar.org/docs/data/apis/rpc/providers)) |
| Facilitator URL | `https://channels.openzeppelin.com/x402` |
| USDC SAC | `USDC_PUBNET_ADDRESS` from `@x402/stellar` (currently `CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75`) |
| OZ Channels API key | Required ([channels.openzeppelin.com/gen](https://channels.openzeppelin.com/gen)) |
| Funding | Real USDC on mainnet (CEX, DEX, or bridge) |

Always test on testnet first. To switch a working setup to mainnet, change only the `.env` (`STELLAR_NETWORK=stellar:pubnet`, `FACILITATOR_URL=https://channels.openzeppelin.com/x402`, mainnet `OZ_API_KEY`, and a mainnet `STELLAR_RECIPIENT`); the samples derive their network from `STELLAR_NETWORK`, so no code changes are needed. OZ Channels requires its API key in the `Authorization: Bearer` header on both networks.

The checklist above assumes OZ Channels: it is the mainnet facilitator Stellar's docs name, and the x402.org facilitator serves `stellar:testnet` only. Any other operator you pick must advertise `stellar:pubnet` in its own `/supported` response — check that before you go live. Self-facilitation is the other mainnet route.

## Key concepts

**Auth entry signing** — On Stellar, x402 clients sign contract authorization entries, not full transaction envelopes. The facilitator assembles the complete transaction. This is lighter than EVM/Solana signing, and means clients never need to manage sequence numbers or pay fees.

**Fee sponsorship** — the facilitator pays the Stellar network fees (~$0.00001/tx), so clients need a funded wallet with USDC but zero XLM. OZ Channels sponsors on both networks; the x402.org facilitator reports `areFeesSponsored: true` for `stellar:testnet`. A facilitator you run yourself pays them from its own account.

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
- Fix: OZ Channels requires an API key on **both** networks. Generate one at [channels.openzeppelin.com/testnet/gen](https://channels.openzeppelin.com/testnet/gen) (testnet) or [channels.openzeppelin.com/gen](https://channels.openzeppelin.com/gen) (mainnet), then set `OZ_API_KEY` and pass it via `createAuthHeaders` (see the Seller example). The 401 is that provider's rule, not x402's — a keyless facilitator answers `/supported` without any auth header.

**Trustline missing on the recipient**
- Symptom: `op_no_trust` during settlement, even though the client has USDC
- Fix: the `payTo` account needs a USDC trustline too. The SAC `transfer` settles the underlying classic asset, which the recipient cannot hold without a trustline. Add `changeTrust` to both accounts during setup.

**Self-hosted facilitator: mainnet settlement times out after verify passes**
- Symptom: on `stellar:pubnet`, `/verify` returns valid but `/settle` never completes, and no transaction from the facilitator account reaches the ledger. The same setup works on testnet.
- Cause: `ExactStellarScheme` from `@x402/stellar/exact/facilitator` bids `BASE_FEE` (100 stroops) as the inclusion fee on the settlement transaction and on the fee bump unless told otherwise. Mainnet Soroban transactions often need more to be included. Check the going rate with the RPC's `getFeeStats` (`sorobanInclusionFee`). See [x402-foundation/x402#3491](https://github.com/x402-foundation/x402/issues/3491).
- Fix: set `inclusionFeeStroops` (available from 2.27.0). It sets the bid on both the settlement transaction and the fee bump:
  ```js
  new ExactStellarScheme([signer], {
    inclusionFeeStroops: 1000, // size it from getFeeStats
    maxTransactionFeeStroops: 50_000, // default; raise it if the bid needs headroom
  });
  ```
  `/verify` adds the bid to the simulated resource fee and rejects the payment (`invalid_exact_stellar_payload_fee_exceeds_maximum`) if the total is over `maxTransactionFeeStroops`. A high bid can therefore need a higher ceiling.
  From 2.19.0 through 2.26.0 the bid is fixed at 100 stroops. Upgrade, or pass a `feeBumpSigner` that rebuilds the fee bump with a higher base fee before signing.
  Hosted facilitators set their own fees, so this only applies when you run `ExactStellarScheme` yourself.

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

# MPP — Machine Payments Protocol (Charge + Session)

MPP is a payment-method-agnostic HTTP 402 protocol, not a Stellar-only one: the core protocol standardizes the 402 Challenge/Credential exchange, and each **payment method** defines how one network settles it ([protocol spec](https://mpp.dev/protocol)). Tempo, Stripe and EVM are other payment methods; this guide documents the [Stellar payment method](https://mpp.dev/payment-methods/stellar). The packages split the same way: `mppx` is the general MPP framework, and `@stellar/mpp` is the Stellar payment method that extends it.

Facilitator-free machine payments settled directly on Stellar: per-request Charge mode and channel-backed Session mode. Companion to [SKILL.md](#agentic-payments-x402--mpp) (decision table, shared testnet setup, USDC addresses); the facilitator-based alternative lives in [x402 — Paid APIs + Agent Buyer Clients](#x402--paid-apis--agent-buyer-clients).

## When to use MPP
MPP is the right choice when:
- You want **no facilitator dependency** — payments settle directly on Stellar via SAC transfers
- Your AI agent makes **many requests per session** — use Session mode (a payment channel under the hood) to pay off-chain and settle once
- You're building a Stellar-native payment stack without relying on third-party infrastructure

Two modes:

| Mode | On-chain txs | Best for |
|------|-------------|----------|
| **Charge** | One per request | Per-request payments, no pre-funding required |
| **Session** | One deposit + one close | High-frequency agents (100s of requests/session) |

If you need zero-XLM clients or the simplest possible setup, use x402 ([x402 — Paid APIs + Agent Buyer Clients](#x402--paid-apis--agent-buyer-clients)) instead.

## Charge mode: per-request payments

Each request triggers a SAC token transfer settled on-chain. No facilitator. Server can optionally sponsor fees so clients don't need XLM.

```bash
npm install express@^5 @stellar/mpp mppx@^0.6.31 @stellar/stellar-sdk@^15 dotenv
npm pkg set type=module
```

> **Version alignment matters:** `@stellar/mpp@0.7.x` pins `@stellar/stellar-sdk@^15.1.0` (installing alongside SDK 13/14 fails with `ERESOLVE`) and `peerDependencies.mppx: ^0.6.29` — pin `mppx@^0.6.31` explicitly, since an unpinned install resolves the latest `mppx` (0.9.x), which falls outside that peer range and also adds a `SecretKey.assert()` guard this doc's "no intent's setup may throw at import time" guarantee assumes isn't there yet. `mppx` also expects `express@>=5`.

**Server:**

```js
// charge-server.js
import express from "express";
import { Mppx } from "mppx/express";
import { Store } from "mppx/server";
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
      store: Store.memory(), // required in charge mode; dev only — use a persistent store in production
      // optional: server pays network fees so clients don't need XLM
      feePayer: process.env.FEE_PAYER_SECRET
        ? { envelopeSigner: StellarSdk.Keypair.fromSecret(process.env.FEE_PAYER_SECRET) }
        : undefined,
    }),
  ],
});

const app = express();
app.use(express.json());

// Mppx.create returns per-intent Express handlers — mount one per paid route.
// The price is set here, per route, not in the method config.
app.get(
  "/data",
  mppx.charge({ amount: "0.001", description: "paid API call" }),
  (req, res) => {
    res.json({ result: "paid content", price: "$0.001 USDC" });
  },
);

app.listen(3002, () => console.log("MPP charge server on http://localhost:3002"));
```

**Client:**

```js
// charge-client.js
import { Mppx } from "@stellar/mpp/charge/client"; // re-exports the client Mppx from mppx/client
import * as stellar from "@stellar/mpp/charge/client";
import * as StellarSdk from "@stellar/stellar-sdk";

const keypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_SECRET_KEY);

const mppx = Mppx.create({
  methods: [
    stellar.charge({
      keypair,
      mode: "pull", // server assembles and broadcasts the transaction
      onProgress(event) {
        // event.type: "challenge" | "signing" | "signed" | "paying" | "confirming" | "paid"
        if (event.type === "paid") console.log("Paid:", event.hash);
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

> **`MPP_SECRET_KEY` must be at least 32 bytes.** `mppx@0.6.31`'s `Mppx.create()` only checks it's present, not its length — a one-character value is accepted and then signs every HMAC challenge. Generate one with `openssl rand -base64 32`. (`mppx@0.9.x` adds this check itself via `SecretKey.assert()`; pinned to `0.6.31` per the install note above, this doc's own examples don't get it for free.)

**`mode: "pull"` vs `"push"`:**
- `"pull"` — client signs auth entries, server assembles + broadcasts (default; use with `feePayer`)
- `"push"` — client builds and broadcasts the transaction directly (client must have XLM for fees)

## Session mode: high-frequency off-chain payments

> **Naming:** current MPP material calls the payment intent a **Session**; it settles over a **one-way payment channel**. Older docs (including earlier versions of this skill) said "Channel mode" — treat that as a synonym. "Channel" below always refers to the settlement mechanism, not the mode.

The client deploys a one-way payment channel contract, deposits USDC once, then signs **cumulative commitments** off-chain for each request. No transaction per request — only two on-chain txs total (deposit + close). Ideal for AI agents making hundreds of calls in a session.

### Session lifecycle

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
import { Mppx } from "mppx/express";
import { Store } from "mppx/server";
import * as stellar from "@stellar/mpp/channel/server";
import { StrKey } from "@stellar/stellar-sdk";

const USDC_SAC_TESTNET = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

// commitmentKey must be a Stellar G... address (or a Keypair) — never raw
// ed25519 bytes. MPP_COMMITMENT_KEY is generated and stored as 64-char hex
// (see the testnet runbook), so re-encode it before handing it to the library.
// Validate the raw string, not the decoded length: Buffer.from(x, "hex")
// stops at the first invalid hex character instead of throwing, so 64
// valid chars followed by garbage still decodes to exactly 32 bytes — a
// length check on the buffer can't catch that. StrKey.encodeEd25519PublicKey()
// doesn't check length either, so a bad value would otherwise silently
// become a plausible-looking wrong G... address instead of an error.
if (!/^[0-9a-f]{64}$/i.test(process.env.MPP_COMMITMENT_KEY)) {
  throw new Error("MPP_COMMITMENT_KEY must be exactly 64 hex characters");
}
const commitmentKey = StrKey.encodeEd25519PublicKey(
  Buffer.from(process.env.MPP_COMMITMENT_KEY, "hex")
);

const mppx = Mppx.create({
  secretKey: process.env.MPP_SECRET_KEY,
  methods: [
    stellar.channel({
      channel: process.env.MPP_CHANNEL_CONTRACT,       // C... contract address
      commitmentKey,
      // Both optional but strongly recommended: the channel contract is
      // deployed out-of-band, so without these the library can't reject a
      // channel that would settle to someone else's account or pay out in
      // the wrong token — it only logs a startup warning and trusts the
      // on-chain contract.
      recipient: process.env.STELLAR_RECIPIENT,        // reused from charge mode
      currency: USDC_SAC_TESTNET,
      store: Store.memory(), // dev only — use persistent store in production
      network: "stellar:testnet",
    }),
  ],
});

const app = express();
app.use(express.json());

// Per-route handler, same adapter model as charge mode; price per route.
app.get(
  "/data",
  mppx.channel({ amount: "0.001", description: "paid API call" }),
  (req, res) => {
    res.json({ result: "paid content" });
  },
);

app.listen(3003);
```

### Client:

```js
// channel-client.js
import { Mppx } from "mppx/client";
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
  channel: process.env.MPP_CHANNEL_CONTRACT,
  amount: lastCumulativeAmount, // bigint, total USDC owed in base units
  signature: lastCommitmentSignature, // hex string from final commitment
  feePayer: { envelopeSigner: StellarSdk.Keypair.fromSecret(process.env.FEE_PAYER_SECRET) },
  network: "stellar:testnet",
});
// Single on-chain transaction settles the full session
console.log("Channel closed:", txHash);
```

**Env vars (server):** `MPP_CHANNEL_CONTRACT`, `MPP_COMMITMENT_KEY`, `STELLAR_RECIPIENT`, `MPP_SECRET_KEY`, `FEE_PAYER_SECRET`
**Env vars (client):** `COMMITMENT_SECRET`

> `MPP_SECRET_KEY` carries the same 32-byte minimum here as in Charge mode above — see the note there.

## Production patterns

Three patterns for running Charge and Session behind the same server,
taken from a deployed service. Its Charge mode was verified end to end
on testnet (settled payments, `pull` and `push`); its mainnet endpoint
has not been verified with a settled payment, so treat these as tested
patterns, not as proof of a production billing history.

### Recipient resolution (recover at boot, fail closed per request)

Two failure modes hit real deployments: `STELLAR_RECIPIENT` isn't set
yet (CI, a fresh environment before secrets are provisioned), or it's
set to the wrong value — a secret key (`S...`) pasted where the public
key belongs, which happens more than you'd expect when a platform's env
var UI doesn't visually distinguish the two. Neither should crash the
server at import time — but neither should let a paid route respond for
free once the server is up. Those are two separate failure surfaces:
booting and billing.

```js
import { Keypair, StrKey } from "@stellar/stellar-sdk";

function resolveRecipient() {
  let raw = (process.env.STELLAR_RECIPIENT || "").trim().replace(/['"]/g, "");
  if (!raw) return "";

  if (raw.startsWith("S")) {
    // A secret key was set where the public key belongs — recover instead
    // of failing. Warn loudly; this should get fixed, not silently relied on.
    try {
      const pub = Keypair.fromSecret(raw).publicKey();
      console.warn(`STELLAR_RECIPIENT is a secret key — derived public key: ${pub.slice(0, 8)}...`);
      return pub;
    } catch {
      console.error("STELLAR_RECIPIENT looks like a secret key but failed to parse — disabling MPP");
      return "";
    }
  }

  // A typo'd G... (wrong length, bad checksum) used to reach the SDK
  // unvalidated and throw several frames deep in Mppx.create(), away from
  // the env var that actually caused it. Fail here instead, with context.
  if (!StrKey.isValidEd25519PublicKey(raw)) {
    console.error(`STELLAR_RECIPIENT is not a valid Stellar public key — disabling MPP: ${raw.slice(0, 8)}...`);
    return "";
  }

  return raw;
}

const RECIPIENT = resolveRecipient();

let chargeMppx = null;
if (RECIPIENT && process.env.MPP_SECRET_KEY) {
  chargeMppx = Mppx.create({ /* ... */ });
} else {
  console.warn("MPP_SECRET_KEY missing, or STELLAR_RECIPIENT missing or invalid — MPP charge middleware disabled");
}

// Every route's middleware checks the instance, not the env var directly.
// Fail CLOSED here, not open: a rotated secret or a misconfigured deploy
// must never turn a paid route into a free one. `next()` would let the
// route respond with its normal 200 and no charge at all — indistinguishable
// from a bug, and silent.
export function mppChargeMiddleware(amount, description) {
  return async (req, res, next) => {
    if (!chargeMppx) {
      res.setHeader("X-MPP-Warning", "MPP not configured on this server");
      res.status(503).json({ error: "MPP charge unavailable — payment middleware not initialized" });
      return;
    }
    // Delegate to the same per-route handler the standalone Charge server
    // example above mounts directly (mppx.charge({ amount, description })),
    // just called manually here instead of passed to app.get() — this
    // factory's whole job is the null-check above it, not a different
    // charge implementation.
    await chargeMppx.charge({ amount, description })(req, res, next);
  };
}
```

The `S...`-key recovery is the case worth stealing even if you don't
need the rest: it turns a silent misconfiguration into a loud warning
plus an explicit `503`, instead of either a `Keypair.fromPublicKey` throw
three layers down in the SDK with no context about which env var caused
it, or — worse — a paid route quietly serving its content for free
because there was nothing left to charge against it.

### Optional dual-intent server

Charge and Session don't have to be an either/or choice at the code
level. Give each mode its own `Mppx` instance, initialize it only when
its full config is present, and let each intent's own middleware fail
closed — never throw, and never let the route respond for free — when
the instance for that intent is `null`. Charge's and
Session's server adapters both export their namespace as `stellar` (see
the Charge and Channel server imports above), so combining them in one
file means aliasing one — here Channel's becomes `stellarChannel`:

```js
import { Mppx } from "mppx/express";
import { Store } from "mppx/server";
import * as stellar from "@stellar/mpp/charge/server";
import * as stellarChannel from "@stellar/mpp/channel/server";
import { Keypair, StrKey } from "@stellar/stellar-sdk";

const USDC_SAC_TESTNET = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

// RECIPIENT is the resolveRecipient() result from the pattern above.

const chargeMppx = (RECIPIENT && process.env.MPP_SECRET_KEY)
  ? Mppx.create({ methods: [stellar.charge({ recipient: RECIPIENT, /* ... */ })] })
  : null;

// Same hex -> G-address re-encoding as the Session server example above,
// but this section's whole point is that no intent's setup may throw at
// import time or take another intent down with it — chargeMppx above must
// stay up even if MPP_COMMITMENT_KEY is garbage. So this catches instead
// of throwing: log it, leave commitmentKey undefined, and let the gate
// below fail Session closed (sessionMppx stays null) exactly the same way
// a genuinely-unset env var already does. Validates the raw string, not
// the decoded length — Buffer.from(x, "hex") stops at the first invalid
// character instead of throwing, so 64 valid chars followed by garbage
// still decodes to exactly 32 bytes.
let commitmentKey;
if (process.env.MPP_COMMITMENT_KEY) {
  if (/^[0-9a-f]{64}$/i.test(process.env.MPP_COMMITMENT_KEY)) {
    commitmentKey = StrKey.encodeEd25519PublicKey(
      Buffer.from(process.env.MPP_COMMITMENT_KEY, "hex")
    );
  } else {
    console.error("MPP_COMMITMENT_KEY is not 64 hex characters — Session mode disabled, Charge unaffected");
  }
}

// Same pattern as commitmentKey above: validate the raw string before
// handing it to Keypair.fromSecret(), which throws on a malformed secret
// key. Unvalidated, that throw happens inside the Mppx.create() call
// below — at import time, taking chargeMppx down with it. Unlike Charge
// (where feePayer is genuinely optional — see the ternary in the Charge
// server example above), Session's own env var list two sections up
// already lists FEE_PAYER_SECRET without "(optional)", and
// channel.Parameters' own doc comment says feePayer is "Required when
// handling close credential actions" — so this validates it, rather than
// treating it as optional the way Charge's ternary does.
let feePayerSigner;
if (process.env.FEE_PAYER_SECRET) {
  if (StrKey.isValidEd25519SecretSeed(process.env.FEE_PAYER_SECRET)) {
    feePayerSigner = Keypair.fromSecret(process.env.FEE_PAYER_SECRET);
  } else {
    console.error("FEE_PAYER_SECRET is not a valid Stellar secret key — Session mode disabled, Charge unaffected");
  }
}

// Same validate-before-use pattern as commitmentKey and feePayerSigner
// above: channel() only validates store, not the channel address itself
// — a typo'd C... value still builds sessionMppx, /info still reports
// Session enabled, and the address only reaches `new Contract(...)`
// deep inside the SDK on the first paid request, where it throws
// "Invalid contract ID" instead of failing at boot the way this whole
// section exists to guarantee.
let channelAddress;
if (process.env.MPP_CHANNEL_CONTRACT) {
  if (StrKey.isValidContract(process.env.MPP_CHANNEL_CONTRACT)) {
    channelAddress = process.env.MPP_CHANNEL_CONTRACT;
  } else {
    console.error("MPP_CHANNEL_CONTRACT is not a valid Stellar contract ID — Session mode disabled, Charge unaffected");
  }
}

const sessionMppx = (
  channelAddress &&
  commitmentKey &&
  RECIPIENT &&
  process.env.MPP_SECRET_KEY &&
  feePayerSigner
)
  ? Mppx.create({
      methods: [
        stellarChannel.channel({
          channel: channelAddress,
          commitmentKey,
          // Strongly recommended, not just optional: RECIPIENT is already a
          // precondition to reach this branch, so wire it through instead of
          // leaving the channel's payout address unverified against it.
          recipient: RECIPIENT,
          currency: USDC_SAC_TESTNET,
          // Required, not optional, in channel.Parameters — same as Charge
          // mode's own store above, already shown in full in the standalone
          // Charge and Session server examples earlier in this file.
          // Omitting it here throws at construction time (inside this same
          // ternary), which is exactly the "no intent's setup may throw"
          // rule this section exists to enforce.
          store: Store.memory(), // dev only — use a persistent store in production
          feePayer: { envelopeSigner: feePayerSigner },
          /* ... */
        }),
      ],
    })
  : null;

export const isSessionEnabled = () => !!sessionMppx;

// Same shape as mppChargeMiddleware above, and for the same reason: a
// route wired up the way the standalone Session server example higher in
// this file shows — sessionMppx.channel({ amount, description }) called
// directly as route middleware — evaluates that call at route
// registration time, which runs at import time. With sessionMppx `null`
// (Session not configured), that throws immediately and takes the whole
// process down, chargeMppx included — exactly what this section's "no
// intent's setup may throw or take another down with it" rule exists to
// prevent. Route through this factory instead of calling sessionMppx
// directly.
export function mppSessionMiddleware(amount, description) {
  return async (req, res, next) => {
    if (!sessionMppx) {
      res.setHeader("X-MPP-Warning", "MPP Session not configured on this server");
      res.status(503).json({ error: "MPP session unavailable — payment middleware not initialized" });
      return;
    }
    // Same delegation as mppChargeMiddleware above, to the Channel
    // equivalent of the standalone server example's mppx.channel({...}).
    await sessionMppx.channel({ amount, description })(req, res, next);
  };
}
```

This is the pattern running on that deployment: Charge mode is
initialized and verified on testnet (not yet on mainnet); Session mode's
instance is `null` there today,
by choice — it requires deploying and funding a channel contract per
deployment, a step that carries custody implications worth a compliance
pass before turning on for a given business. Session works the same way
Charge does once its five env vars are set; nothing in the server code
changes when you flip it on later. What this pattern buys you is
shipping Charge on day one without a rewrite pending.

### Runtime configuration-status endpoint (`/info`)

Not the OpenAPI discovery document below, and not a health check either —
call it that and a caller will expect it to confirm the Soroban RPC, the
facilitator, and the store backend it depends on are actually reachable
right now. It doesn't: it only reports whether each intent's `Mppx`
instance was constructed at startup, which is configuration state, not
live dependency health. A client (human or agent) shouldn't have to guess
which intents are live. Report the true initialization state, not a
static capability list — `enabled` reflects whether the instance actually
initialized:

```js
app.get("/info", (_req, res) => {
  res.json({
    protocol: "mpp",
    intents: {
      charge: {
        enabled: !!chargeMppx,
        routes: { data: { path: "/data", price: "0.001 USDC" } },
      },
      session: {
        enabled: isSessionEnabled(),
        // channelAddress, not process.env.MPP_CHANNEL_CONTRACT directly — channelAddress
        // is undefined when the raw env var failed StrKey.isValidContract() above, so a
        // rejected value shows null here instead of appearing valid beside enabled: false.
        channelContract: channelAddress || null,
        note: "Off-chain cumulative commitments, two on-chain txs total (deposit + close).",
      },
    },
  });
});
```

An agent that reads this before its first request can pick a configured
intent instead of finding out from a 503 that Session was never
configured.

## Discovery: let agents find your paid API

Charge and Session modes answer one question: how do I charge? Discovery answers a second: how does a paying agent find me? Without discovery you ship a working paid API that no agent can locate.

A paid MPP server publishes an [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) document at `GET /openapi.json`. Each paid operation carries an `x-payment-info` extension holding an `offers[]` array. Registries aggregate those documents so agents can search for paid APIs.

> **Discovery is advisory.** The document is an informational hint for display and planning. The runtime **402 Challenge is authoritative** for price, token, network, expiry, and terms. Read the payment terms from the Challenge, never from the discovery document.

### Serve the document

`mppx/express` exports `discovery()`. It mounts `GET /openapi.json` and derives each offer from the method config and the per-route handler, so the document stays in step with the Challenges the route returns.

Edit the Charge mode server above — don't append this to it. A second `mppx/express` import redeclares `Mppx`, and a second `/data` route never runs.

```js
// charge-server.js

// 1. Replace the existing `mppx/express` import with this one.
import { Mppx, discovery } from "mppx/express";

// 2. Replace the inline app.get("/data", ...) block with these two.
//    discovery() reads the price off the handler object, so name it.
const pay = mppx.charge({ amount: "0.001", description: "paid API call" });

app.get("/data", pay, (req, res) => {
  res.json({ result: "paid content", price: "$0.001 USDC" });
});

// 3. Add this after the route, before app.listen().
discovery(app, mppx, {
  info: { title: "Paid Data API", version: "1.0.0" },
  routes: [{ handler: pay, method: "get", path: "/data" }],
});
```

Session mode works the same way — pass the `mppx.channel(...)` handler in `routes`.

Validate the document before you publish it:

```bash
npx mppx discover validate http://localhost:3002/openapi.json
```

### Register the service (optional)

| Registry | What it is | How to list |
|----------|------------|-------------|
| [MPPScan](https://mppscan.com) | Public registry of MPP services, with search and analytics | [Register](https://www.mppscan.com/register) |
| [MPP services directory](https://mpp.dev/services) | Curated list of live services on mpp.dev | [Submission guide](https://mpp.dev/services#list-your-service) |

Agents can query the curated directory over MCP at `https://mpp.dev/mcp/services`. That server is read-only.

A registry listing advertises your service. It does not verify any client payment. Your server still issues the 402 Challenge and verifies the Credential on every request.

Full reference: [MPP discovery docs](https://mpp.dev/advanced/discovery).

## Packages and subpath imports

```bash
npm install @stellar/mpp mppx@^0.6.31 @stellar/stellar-sdk@^15
```

Pinned for the same reason as the Charge mode install above: `@stellar/mpp@0.7.1` declares `peerDependencies` of `mppx: ^0.6.29` and `@stellar/stellar-sdk: ^15.1.0`, but unpinned resolves each package's `latest` tag today (`mppx@0.9.2`, `@stellar/stellar-sdk@17.0.1`) — both outside those ranges, so an unpinned install fails with `ERESOLVE`.

| Import path | Recommended import pattern |
|-------------|----------------------------|
| `@stellar/mpp/charge/server` | `import * as stellar from "@stellar/mpp/charge/server"` — use `stellar.charge(...)` |
| `@stellar/mpp/charge/client` | `import * as stellar from "@stellar/mpp/charge/client"` — use `stellar.charge(...)` |
| `@stellar/mpp/channel/server` | `import * as stellar from "@stellar/mpp/channel/server"` — use `stellar.channel(...)`, `stellar.close(...)`, `stellar.getChannelState(...)`, `stellar.watchChannel(...)` |
| `@stellar/mpp/channel/client` | `import * as stellar from "@stellar/mpp/channel/client"` — use `stellar.channel(...)` |
| `@stellar/mpp/channel` | Zod schema definitions for channel types |
| `mppx/express` | `import { Mppx, discovery } from "mppx/express"` — Express adapter; `Mppx.create(...)` returns per-route handlers, `discovery(...)` mounts `/openapi.json` |
| `mppx/server` | `import { Mppx, Store } from "mppx/server"` — framework-agnostic server + `Store` |
| `mppx/client` | `import { Mppx } from "mppx/client"` — client; also re-exported by `@stellar/mpp/charge/client` |

> The bare `mppx` root does **not** export `Mppx` at all — always import it from the subpaths above. (`Store` *is* re-exported from the root and is the same object as `mppx/server`'s, but importing it from `mppx/server` keeps the server imports together.)

## Testnet runbook

**Steps shared with all protocols:**
1. Generate keypair + fund with Friendbot — see the [shared testnet setup in SKILL.md](#testnet-setup-shared)
2. Add USDC trustline (same shared setup)
3. Get testnet USDC from [Circle faucet](https://faucet.circle.com/)

**Session mode only:**
4. Deploy the one-way-channel contract (see [stellar-mpp-sdk](https://github.com/stellar/stellar-mpp-sdk) for deploy script)
5. Generate a 64-char hex ed25519 seed for the commitment key — this value
   is `COMMITMENT_SECRET`, kept on the **client** only:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. Derive the corresponding public key from that same seed — this is
   `MPP_COMMITMENT_KEY`, what the **server** holds, stored as hex the same
   way (the server code above re-encodes it to a G... address at startup).
   Export the seed from step 5 first, then read it from the environment
   rather than passing it as a bare CLI argument:
   ```bash
   export COMMITMENT_SECRET="<64-char hex from step 5>"
   node -e "const {Keypair}=require('@stellar/stellar-sdk');const seed=Buffer.from(process.env.COMMITMENT_SECRET,'hex');console.log(Keypair.fromRawEd25519Seed(seed).rawPublicKey().toString('hex'))"
   ```
   Then fund the channel with USDC before making requests.

## Common pitfalls

**Charge: server throws `A store is required for charge mode` at startup**
- Symptom: `Error: [stellar:charge] A store is required for charge mode. Provide a Store instance…`
- Fix: pass `store: Store.memory()` (dev) or a persistent store to `stellar.charge({ ... })` — charge mode requires one, not just session mode.

**Install fails with `ERESOLVE`**
- Symptom: npm refuses to install `@stellar/mpp` alongside an existing stellar-sdk 13/14, or alongside an unpinned `mppx`
- Fix: `@stellar/mpp@0.7.x` pins `@stellar/stellar-sdk@^15.1.0` and `peerDependencies.mppx: ^0.6.29`, and `mppx` expects `express@>=5` — align versions per the install note above, including the `mppx@^0.6.31` pin (an unpinned install resolves the latest 0.9.x, outside that peer range).

**Session: wrong commitment key format**
- Symptom: `Keypair.fromRawEd25519Seed` throws or signatures fail to verify
- Fix: two different 64-char hex values, not a Stellar `S...` secret key and not interchangeable. `COMMITMENT_SECRET` (client only) is the raw ed25519 **seed** — generate with `crypto.randomBytes(32).toString('hex')`. `MPP_COMMITMENT_KEY` (server) is the **public key** derived from that same seed, hex-encoded the same way — never the seed itself. See the testnet runbook above for the derivation step.

**Session: non-cumulative amounts**
- Symptom: server rejects commitments after the first request
- Fix: each commitment's `amount` must be the **running total** of all payments so far, not just the price of the current request. The server tracks the highest-seen commitment.

**Session: deposit TTL expired**
- Symptom: `close()` fails or channel appears drained
- Fix: Contract storage has a TTL. Close the channel before it expires, or extend storage TTL via `bumpContractInstance`. Don't leave channels open indefinitely.

**Charge: client has no XLM for fees**
- Symptom: `op_insufficient_balance` or fee errors on client-submitted transactions
- Fix: set `mode: "pull"` on the client and configure `feePayer` on the server so the server pays fees. The client only signs auth entries.

**Discovery: client trusts the discovery price**
- Symptom: the client pays the amount from `/openapi.json` and the server rejects the Credential
- Fix: the discovery document is advisory. Take price, token, network, expiry, and terms from the 402 Challenge.

**Discovery: route missing from `/openapi.json`**
- Symptom: the document builds, but a paid route carries no `x-payment-info`
- Fix: on Express, `discovery()` only documents routes listed in `routes`. Add one entry per paid route, and pass the same handler object you mounted on the route.

**`Store.memory()` in production**
- Symptom: server loses track of channel state on restart, enables double-spend
- Fix: replace `Store.memory()` with a persistent store (database-backed) before going to production.
