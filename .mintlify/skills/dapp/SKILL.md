---
name: dapp
description: Stellar dApp / frontend development. Covers the JavaScript stellar-sdk (browser + Node.js), Varial wallet, Stellar Wallets Kit (multi-wallet), Wallet Standard, smart accounts with passkeys, transaction building / signing / submission, smart contract invocation from the client, simulation, and error handling. Use when building a React/Next.js/Node.js app that talks to Stellar — classic operations or smart contracts. Blux is also an option.
user-invocable: true
argument-hint: "[dapp task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Stellar dApp / Frontend

Client-side development with `@stellar/stellar-sdk`, wallet connection, signing, and submitting transactions. Covers both classic Stellar operations and smart contract invocation from the browser or Node.js.

## When to use this skill
- Connecting Varial or other wallets via Stellar Wallets Kit
- Building, simulating, signing, and submitting transactions
- Invoking Stellar smart contracts from a frontend
- Implementing smart accounts with passkeys
- Handling network passphrases (Mainnet / Testnet / local)

## Related skills
- Writing the contract being invoked → `/.well-known/agent-skills/smart-contracts/skill.md`
- Issuing assets and managing trustlines → `/.well-known/agent-skills/assets/skill.md`
- Querying chain state via RPC / Horizon → `/.well-known/agent-skills/data/skill.md`
- Building paid APIs or agent payment clients → `/.well-known/agent-skills/agentic-payments/skill.md`
- SEPs the wallet/anchor flows depend on → `/.well-known/agent-skills/standards/skill.md`

---


## Goals
- Single SDK instance for the app (RPC/Horizon + transaction building)
- Varial wallet integration (or multi-wallet via Stellar Wallets Kit)
- Clean separation of client/server in Next.js
- Transaction sending with proper confirmation handling

## Read the file that matches the task

This file covers SDK setup, wallet connection, and transaction build/sign/submit. The deep dives live alongside it:

| Task | Section |
|------|------|
| SDK setup and env config | [SDK Initialization](#sdk-initialization) (below) |
| Wallet integrations (Varial, Wallets Kit) | [Wallet Integration](#wallet-integration) (below) |
| Tx build/send patterns | [Transaction Building](#transaction-building), [Transaction Submission](#transaction-submission) (below) |
| Connect-wallet button, payment form, Next.js App Router wiring | [React & Next.js Patterns](#react--nextjs-patterns) |
| Account balances, contract reads (`queryContract`), raw ledger entries | [Client-Side Data Fetching](#client-side-data-fetching) |
| Passkey smart wallets (Smart Account Kit), gasless tx via OpenZeppelin Relayer | [Smart Accounts (Passkeys) & Fee Sponsorship](#smart-accounts-passkeys--fee-sponsorship) |
| Production UX checklist | [Transaction UX Checklist](#transaction-ux-checklist) (below) |

## Recommended Dependencies

> **Requires Node.js 22+.** As of SDK v16, Node 22 is the minimum (older Node produces an `EBADENGINE` warning). v16 also folded `@stellar/stellar-base` into `@stellar/stellar-sdk`, is ESM-first, and uses native `fetch` instead of axios. If you still import `@stellar/stellar-base` directly, switch the import to `@stellar/stellar-sdk` and uninstall the base package (keeping both breaks `instanceof` checks). See the [migration guide](https://stellar.github.io/js-stellar-sdk/guides/00-migration).

```bash
npm install @stellar/stellar-sdk @stellar/varial-sdk
# Or for multi-wallet support — Wallets Kit v2 is distributed on JSR, not npm:
npx jsr add @creit-tech/stellar-wallets-kit
```

> **Sourcing:** SDK mechanics below (init, transaction building, contract invocation, submission, data fetching, error handling) track the official [JS SDK docs](https://stellar.github.io/js-stellar-sdk/) (which also publish [`llms.txt`](https://stellar.github.io/js-stellar-sdk/llms.txt) / [`llms-full.txt`](https://stellar.github.io/js-stellar-sdk/llms-full.txt) bundles for agents). Wallet integrations (Varial, Stellar Wallets Kit), passkey smart accounts, and the OpenZeppelin relayer are separate packages, not part of the JS SDK — verify those against their own upstream docs.

## SDK Initialization

> For the full API reference (RPC methods, Horizon endpoints, migration guide), see the [data skill](/.well-known/agent-skills/data/skill.md).

### Basic Setup
```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

// For Testnet
const testnetServer = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const testnetRpc = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");
const testnetNetworkPassphrase = StellarSdk.Networks.TESTNET;

// For Mainnet
const mainnetServer = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
const mainnetRpcUrl = process.env.NEXT_PUBLIC_STELLAR_MAINNET_RPC_URL;
if (!mainnetRpcUrl) throw new Error("Missing NEXT_PUBLIC_STELLAR_MAINNET_RPC_URL");
const mainnetRpc = new StellarSdk.rpc.Server(mainnetRpcUrl); // set from your chosen RPC provider
const mainnetNetworkPassphrase = StellarSdk.Networks.PUBLIC;
```

### Environment Configuration
> Use a provider-specific mainnet RPC URL (see: https://developers.stellar.org/docs/data/apis/rpc/providers).

```typescript
// lib/stellar.ts
import * as StellarSdk from "@stellar/stellar-sdk";

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

function getConfig(network: string) {
  switch (network) {
    case "testnet":
      return {
        horizonUrl: "https://horizon-testnet.stellar.org",
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: StellarSdk.Networks.TESTNET,
        friendbotUrl: "https://friendbot.stellar.org" as string | null,
      };
    case "mainnet":
      return {
        horizonUrl: "https://horizon.stellar.org",
        // Resolved lazily so testnet runs don't require the mainnet env var
        rpcUrl: requireEnv("NEXT_PUBLIC_STELLAR_MAINNET_RPC_URL"),
        networkPassphrase: StellarSdk.Networks.PUBLIC,
        friendbotUrl: null,
      };
    default:
      throw new Error(`Unknown network: ${network}`);
  }
}

export const config = getConfig(NETWORK);

export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);
export const rpc = new StellarSdk.rpc.Server(config.rpcUrl);
```

## Wallet Integration

### Varial (Primary Browser Wallet)
```typescript
// hooks/useVarial.ts
import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
  getNetwork,
} from "@stellar/varial-sdk";

export function useVarial() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const { isConnected: installed, error } = await isConnected();
    if (error || !installed) return;

    // getAddress returns address: "" until the app has been granted access,
    // so a non-empty address means we're already authorized.
    const { address: addr, error: addressError } = await getAddress();
    if (addressError || !addr) return;

    const { network: net, error: networkError } = await getNetwork();
    if (networkError) return;
    setConnected(true);
    setAddress(addr);
    setNetwork(net);
  };

  const connect = useCallback(async () => {
    const { isConnected: installed, error } = await isConnected();
    if (error || !installed) {
      throw new Error("Varial extension not installed");
    }

    // requestAccess prompts the user and returns the granted address.
    const { address: addr, error: accessError } = await requestAccess();
    if (accessError) throw new Error(accessError.message);

    const { network: net, error: networkError } = await getNetwork();
    if (networkError) throw new Error(networkError.message);
    setConnected(true);
    setAddress(addr);
    setNetwork(net);

    return addr;
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(null);
    setNetwork(null);
  }, []);

  const sign = useCallback(
    async (xdr: string, networkPassphrase: string) => {
      if (!connected) throw new Error("Wallet not connected");
      const { signedTxXdr, error } = await signTransaction(xdr, {
        networkPassphrase,
      });
      if (error) throw new Error(error.message);
      return signedTxXdr;
    },
    [connected]
  );

  return { connected, address, network, connect, disconnect, sign };
}
```

### Stellar Wallets Kit (Multi-Wallet)

```typescript
// hooks/useStellarWallet.ts
import { useState, useCallback } from "react";
import { StellarWalletsKit, Networks } from "@creit-tech/stellar-wallets-kit";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";

// v2 is a static singleton: init once at module load, then call static methods —
// there is no instance to construct or pass around.
// defaultModules() loads every wallet that needs no extra setup; modules with
// prerequisites (WalletConnect, Ledger, Trezor) must be imported and added explicitly.
StellarWalletsKit.init({
  modules: defaultModules(),
  network: Networks.TESTNET,
});

export function useStellarWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    // authModal() opens the wallet picker, sets the chosen module active,
    // and returns the address — one call replaces v1's openModal callback dance.
    const { address } = await StellarWalletsKit.authModal();
    setAddress(address);
  }, []);

  const disconnect = useCallback(async () => {
    await StellarWalletsKit.disconnect();
    setAddress(null);
  }, []);

  const sign = useCallback(async (xdr: string) => {
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr);
    return signedTxXdr;
  }, []);

  return { address, connect, disconnect, sign };
}
```

> **Migrating from v1?** (noted July 2026) v1 lived on npm under the dotted scope `@creit.tech/stellar-wallets-kit`, with `new StellarWalletsKit({...})`, `allowAllModules()`, and `openModal({ onWalletSelected })`. v2 moved to JSR under `@creit-tech/stellar-wallets-kit`, made the kit fully static, replaced `allowAllModules()` with `defaultModules()`, and folded wallet selection + address fetch into `authModal()`. npm parity is maintained for now, but the maintainers say npm updates will eventually stop — install from JSR. Pre-selecting a wallet (`setWallet(FREIGHTER_ID)`) still works; the ID constants now live in per-wallet module subpaths like `@creit-tech/stellar-wallets-kit/modules/freighter`.

You can also use [Blux](https://blux.cc) for wallet integration and contract calls. See [React & Next.js Patterns](#react--nextjs-patterns) and [Client-Side Data Fetching](#client-side-data-fetching) for examples.

## Transaction Building

### Basic Payment
```typescript
import * as StellarSdk from "@stellar/stellar-sdk";
import { horizon, config } from "@/lib/stellar";

export async function buildPaymentTx(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
  asset: StellarSdk.Asset = StellarSdk.Asset.native()
) {
  const account = await horizon.loadAccount(sourceAddress);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: asset,
        amount: amount,
      })
    )
    .setTimeout(180)
    .build();

  return transaction.toXDR();
}
```

### Smart Contract Invocation (`contract.Client`)

The canonical way to call a Stellar smart contract from JS is the `contract.Client`, not hand-built `Contract.call` + `assembleTransaction`. The client reads the contract's interface from the network, so each method is callable by name and returns an `AssembledTransaction`. You get a native JS result and don't build ScVals by hand.

```typescript
import { contract } from "@stellar/stellar-sdk";
import { config } from "@/lib/stellar";

// Describe just the methods you call. `Client.from<T>()` uses this to type
// the returned client, so calls are checked and autocompleted — no codegen.
// For a contract with many methods, generate this interface from its spec
// with the SDK's binding CLI instead of writing it by hand.
interface CounterContract {
  increment: (
    options?: contract.MethodOptions,
  ) => Promise<contract.AssembledTransaction<number>>;
}

// `signTransaction` comes from the wallet (e.g. Varial/Wallets Kit in the
// browser). `contract.basicNodeSigner(keypair, networkPassphrase)` is the
// Node equivalent for scripts and tests.
export async function getCounterClient(
  contractId: string,
  publicKey: string,
  signTransaction: contract.ClientOptions["signTransaction"],
) {
  return contract.Client.from<CounterContract>({
    contractId,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
    publicKey,
    signTransaction,
  });
}

// Preview (free simulation) then sign + send to apply on-chain.
export async function increment(client: contract.Client & CounterContract) {
  const tx = await client.increment();
  console.log("preview:", tx.result); // predicted return value, no signature
  const sent = await tx.signAndSend(); // submits and polls to completion
  return sent.result;
}
```

`AssembledTransaction` also supports fine-grained control (`{ fee, simulate, timeoutInSeconds }` as a second arg) and multi-party auth via `tx.needsNonInvokerSigningBy()` / `tx.signAuthEntries()`. See [Invoke a Contract](https://stellar.github.io/js-stellar-sdk/guides/06-invoke-a-contract) and [Authorize a Contract Call](https://stellar.github.io/js-stellar-sdk/guides/07-contract-auth).

<details>
<summary><b>Advanced: low-level invocation without a client</b></summary>

Use this only when you need direct control over simulation and assembly (e.g. to adjust resources or auth entries before signing). Otherwise prefer `contract.Client` above.

A smart contract transaction holds exactly one operation: `invokeHostFunction`, `extendFootprintTtl` or `restoreFootprint`. You cannot batch a contract call with classic operations (a payment, `manageData`, a trustline change). RPC simulation rejects that shape ("Transaction contains more than one operation"), so `prepareTransaction` throws, and the network rejects it as `txMALFORMED`. To do several things atomically, do them inside one contract call (a contract can call other contracts, including a classic asset's SAC). Otherwise send separate transactions.

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc, config } from "@/lib/stellar";

export async function invokeContract(
  sourceAddress: string,
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[]
) {
  const account = await rpc.getAccount(sourceAddress);
  const contract = new StellarSdk.Contract(contractId);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(180)
    .build();

  // `prepareTransaction` simulates and applies footprint/auth/fees in one step.
  // (Equivalent to simulateTransaction + rpc.assembleTransaction.)
  const prepared = await rpc.prepareTransaction(transaction);
  return prepared.toXDR();
}
```

**Building ScVal arguments by hand** (only needed for the low-level path — `contract.Client` converts native JS args for you):

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

const addressVal = StellarSdk.Address.fromString(address).toScVal();
const i128Val = StellarSdk.nativeToScVal(BigInt(amount), { type: "i128" });
const u32Val = StellarSdk.nativeToScVal(42, { type: "u32" });
const stringVal = StellarSdk.nativeToScVal("hello", { type: "string" });
const symbolVal = StellarSdk.nativeToScVal("transfer", { type: "symbol" });

// Struct
const structVal = StellarSdk.nativeToScVal(
  { name: "Token", decimals: 7 },
  {
    type: {
      name: ["symbol", null],
      decimals: ["u32", null],
    },
  }
);

// Vec of i128 — the element type is applied to each item
const vecVal = StellarSdk.nativeToScVal(
  [1, 2, 3].map((n) => BigInt(n)),
  { type: "i128" }
);
```

</details>

## Transaction Submission

### Submit and Wait for Confirmation
```typescript
import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc, horizon, config } from "@/lib/stellar";

export async function submitTransaction(signedXdr: string) {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    config.networkPassphrase
  );

  // For smart contract transactions, use RPC
  if (transaction.operations.some(op => op.type === "invokeHostFunction")) {
    return submitSorobanTransaction(signedXdr);
  }

  // For classic transactions, use Horizon
  return submitClassicTransaction(signedXdr);
}

async function submitSorobanTransaction(signedXdr: string) {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    config.networkPassphrase
  ) as StellarSdk.Transaction;

  // status: "PENDING" | "DUPLICATE" | "TRY_AGAIN_LATER" | "ERROR"
  let response = await rpc.sendTransaction(transaction);

  // TRY_AGAIN_LATER: not queued. Usually this source account already has a
  // transaction in flight, so resending the same signed transaction is safe.
  // If the queue was full, stellar-core bans this exact transaction for 10
  // ledgers, so resends keep failing: rebuild and re-sign with a higher fee.
  for (let i = 0; response.status === "TRY_AGAIN_LATER" && i < 5; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    response = await rpc.sendTransaction(transaction);
  }

  if (response.status === "ERROR") {
    // errorResult is the parsed TransactionResult (raw RPC field: errorResultXdr)
    throw new Error("Transaction rejected", { cause: response.errorResult });
  }
  if (response.status === "TRY_AGAIN_LATER") {
    throw new Error("Not queued; rebuild with a higher fee or resubmit later");
  }

  // PENDING or DUPLICATE (already queued): poll for completion.
  // pollTransaction handles the retry loop (default 30 attempts, 1s apart;
  // tune with { attempts, sleepStrategy }) instead of a hand-rolled while
  // loop that can spin forever.
  const getResponse = await rpc.pollTransaction(response.hash);

  if (getResponse.status === "SUCCESS") {
    return {
      hash: response.hash,
      result: getResponse.returnValue,
    };
  }

  throw new Error(`Transaction failed: ${getResponse.status}`);
}

async function submitClassicTransaction(signedXdr: string) {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    config.networkPassphrase
  ) as StellarSdk.Transaction;

  const response = await horizon.submitTransaction(transaction);
  return {
    hash: response.hash,
    ledger: response.ledger,
  };
}
```

## Transaction UX Checklist

- [ ] Show loading state during wallet signing
- [ ] Display transaction hash immediately after submission
- [ ] Track confirmation status (pending → success/failed)
- [ ] Handle common errors with clear messages:
  - Wallet not connected
  - User rejected signing
  - Insufficient XLM for fees
  - Account not funded
  - Network mismatch (wallet on wrong network)
  - Transaction timeout/expired
- [ ] Prevent double-submission while processing
- [ ] Show destination and amount before signing

---

# React & Next.js Patterns

React components and Next.js App Router wiring for a Stellar dapp. Companion to [SKILL.md](#stellar-dapp--frontend) (SDK setup, wallets, transactions); client-side reads live in [Client-Side Data Fetching](#client-side-data-fetching), passkey wallets in [Smart Accounts (Passkeys) & Fee Sponsorship](#smart-accounts-passkeys--fee-sponsorship).

## React Components

The Blux examples below assume the app is wrapped in `BluxProvider` with an `appId` from [dashboard.blux.cc](https://dashboard.blux.cc) ([setup](#provider-component); more at [blux.cc](https://blux.cc)).

### Connect Wallet Button
```tsx
// components/ConnectButton.tsx
"use client";

import { useVarial } from "@/hooks/useVarial";

export function ConnectButton() {
  const { connected, address, connect, disconnect } = useVarial();

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {address.slice(0, 4)}...{address.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Connect Wallet
    </button>
  );
}
```

If you use Blux, [`useBlux`](https://docs.blux.cc/react/usage/login) provides the login modal and connection state:

```tsx
"use client";

import { useBlux } from "@bluxcc/react";

export function BluxConnectButton() {
  const { login, isReady, isAuthenticated } = useBlux();
  return (
    <button onClick={login} disabled={!isReady || isAuthenticated}>
      {isAuthenticated ? "Connected" : "Connect Wallet"}
    </button>
  );
}
```

### Send Payment Form
```tsx
// components/SendPayment.tsx
"use client";

import { useState } from "react";
import { useVarial } from "@/hooks/useVarial";
import { buildPaymentTx, submitTransaction } from "@/lib/transactions";
import { config } from "@/lib/stellar";

export function SendPayment() {
  const { address, sign } = useVarial();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setStatus("Building transaction...");

    try {
      const xdr = await buildPaymentTx(address, destination, amount);

      setStatus("Please sign in your wallet...");
      const signedXdr = await sign(xdr, config.networkPassphrase);

      setStatus("Submitting transaction...");
      const result = await submitTransaction(signedXdr);

      setStatus(`Success! Hash: ${result.hash}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Destination Address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Amount (XLM)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading || !address}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send"}
      </button>
      {status && <p className="text-sm">{status}</p>}
    </form>
  );
}
```

If you use Blux, [`useTransfer`](https://docs.blux.cc/react/hooks/use-transfer) builds, signs, and submits the XLM payment:

```tsx
"use client";

import { useState } from "react";
import { useBlux, useTransfer } from "@bluxcc/react";

export function BluxSendPayment() {
  const { isAuthenticated } = useBlux();
  const { transfer, isPending, data, error } = useTransfer();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      transfer({ to, amount });
    }}>
      <input aria-label="Destination address" required value={to} onChange={(e) => setTo(e.target.value)} />
      <input aria-label="Amount (XLM)" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button disabled={!isAuthenticated || isPending}>Send XLM</button>
      {data && <p>Sent: {data.hash}</p>}
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

For an existing transaction XDR, use [`useBlux().sendTransaction`](https://docs.blux.cc/react/usage/send-transaction); it signs and submits classic or Soroban transactions:

```tsx
"use client";

import { useBlux } from "@bluxcc/react";

export function BluxSendButton({ xdr }: { xdr: string }) {
  const { sendTransaction, isAuthenticated } = useBlux();
  return (
    <button
      disabled={!isAuthenticated}
      onClick={() => sendTransaction(xdr).catch(console.error)}
    >
      Send
    </button>
  );
}
```

## Next.js App Router Setup

### Provider Component
```tsx
// app/providers.tsx
"use client";

import { ReactNode } from "react";

// Add any context providers here
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

If you use Blux, install `@bluxcc/react` and use this provider instead:

```tsx
// app/providers.tsx
"use client";

import type { ReactNode } from "react";
import { BluxProvider, networks } from "@bluxcc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BluxProvider config={{
      appId: "your-app-id", // take this from https://dashboard.blux.cc
      networks: [networks.testnet],
    }}>
      {children}
    </BluxProvider>
  );
}
```

### Layout
```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

# Client-Side Data Fetching

Reading balances and contract state from the client. Companion to [SKILL.md](#stellar-dapp--frontend); UI patterns live in [React & Next.js Patterns](#react--nextjs-patterns).

## Data Fetching

### Account Balance
```typescript
import { NotFoundError } from "@stellar/stellar-sdk";
import { horizon } from "@/lib/stellar";

export async function getBalance(address: string) {
  try {
    const account = await horizon.loadAccount(address);
    const nativeBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );
    return nativeBalance?.balance || "0";
  } catch (error) {
    // loadAccount rejects with the typed NotFoundError for an unfunded account.
    if (error instanceof NotFoundError) {
      return "0"; // Account not funded yet
    }
    throw error;
  }
}
```

If you use Blux, [`core.getBalances`](https://docs.blux.cc/javascript/core/getBalances) returns the account's asset balances. Initialize Blux with your [dashboard appId](https://dashboard.blux.cc) first ([setup](https://docs.blux.cc/getting-started); more at [blux.cc](https://blux.cc)).

```typescript
import { core } from "@bluxcc/core";

const result = await core.getBalances({ address: "G..." }); // Omit address to use the connected address.
```

> For submission failures, Horizon returns result codes under `error.response?.data?.extras?.result_codes` (`transaction` + per-`operation`). See [Handle Errors](https://stellar.github.io/js-stellar-sdk/guides/05-handle-errors).

### Contract State

For a read-only contract call, `rpc.Server` has one-line shortcuts that build the contract interface for you (including the built-in spec for Stellar Asset Contracts), so no client setup or manual ScVal work is needed:

```typescript
import { rpc } from "@/lib/stellar";

// Run a read-only method and get the decoded result directly.
const { result: balance, isReadCall } = await rpc.queryContract<bigint>(
  tokenId,
  "balance",
  { id: "G..." } // named args, keyed by parameter name; omit for no-arg methods
);

// Discover a contract's callable methods from just its ID.
const methods = await rpc.getContractMethods(tokenId);
// [{ name: "balance", inputs: [{ name: "id", type: "Address" }], outputs: ["I128"] }, ...]
```

`isReadCall` is per-call: `false` means the `result` is only a simulation preview of a call that would change state (apply it by signing a transaction via `contract.Client`).

If you use Blux in React, [`useReadContracts`](https://docs.blux.cc/react/hooks/use-read-contracts) can read two token contracts in one hook call under `BluxProvider` ([setup](#provider-component)):

```tsx
"use client";

import { useReadContracts } from "@bluxcc/react";

export function TokenBalances({ tokenA, tokenB, address }: {
  tokenA: string; tokenB: string; address: string;
}) {
  const { data, isLoading, error } = useReadContracts<[string, string]>([
    { address: tokenA, fn: "balance", args: [address] },
    { address: tokenB, fn: "balance", args: [address] },
  ]);
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading...</p>;
  return <p>Token A: {data?.values[0]}, Token B: {data?.values[1]}</p>;
}
```

<details>
<summary><b>Advanced: read a raw ledger entry</b></summary>

Reach for `getLedgerEntries` only when you need a specific storage key that isn't exposed as a contract method.

```typescript
import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc } from "@/lib/stellar";

export async function getContractData(
  contractId: string,
  key: StellarSdk.xdr.ScVal
) {
  const ledgerKey = StellarSdk.xdr.LedgerKey.contractData(
    new StellarSdk.xdr.LedgerKeyContractData({
      contract: new StellarSdk.Address(contractId).toScAddress(),
      key: key,
      durability: StellarSdk.xdr.ContractDataDurability.persistent(),
    })
  );

  const entries = await rpc.getLedgerEntries(ledgerKey);

  if (entries.entries.length === 0) {
    return null;
  }

  return StellarSdk.scValToNative(
    entries.entries[0].val.contractData().val()
  );
}
```

</details>

---

# Smart Accounts (Passkeys) & Fee Sponsorship

Passkey smart wallets with Smart Account Kit and gasless transactions via the OpenZeppelin Relayer. Companion to [SKILL.md](#stellar-dapp--frontend).

## Smart Accounts (Passkey Wallets)

For passwordless authentication using WebAuthn passkeys, use Smart Account Kit. [Passkey Kit](https://github.com/stellar/passkey-kit) is a sibling SDK built on a different authorization model — see [Choosing between the two kits](#choosing-between-the-two-kits) before you commit to one.

### Installation
```bash
npm install smart-account-kit
```

### Quick Start
```typescript
import { SmartAccountKit, IndexedDBStorage } from 'smart-account-kit';

const kit = new SmartAccountKit({
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  accountWasmHash: 'YOUR_ACCOUNT_WASM_HASH',
  webauthnVerifierAddress: 'CWEBAUTHN_VERIFIER_ADDRESS',
  storage: new IndexedDBStorage(),
});

// On page load - silent restore from stored session
const restored = await kit.connectWallet();
if (!restored) {
  showConnectButton(); // No stored session
}

// Create new wallet with passkey
const { contractId, credentialId } = await kit.createWallet(
  'My App',
  'user@example.com',
  { autoSubmit: true }
);

// Connect to existing wallet (prompts for passkey)
await kit.connectWallet({ prompt: true });

// Sign and submit transactions
const result = await kit.signAndSubmit(transaction);

// Transfer tokens
await kit.transfer(tokenContract, recipient, amount);
```

### Key Features
- **Session Management**: Automatic credential persistence and silent reconnection
- **Multiple Signer Types**: Passkeys (secp256r1), Ed25519 keys, policies
- **Context Rules**: Fine-grained authorization for different operations
- **Policy Support**: Threshold multisig, spending limits, custom policies
- **External Wallet Support**: Connect Varial, LOBSTR via adapters
- **Gasless Transactions**: Optional relayer integration for fee sponsoring

### Fee Sponsorship with OpenZeppelin Relayer

The [OpenZeppelin Relayer](https://docs.openzeppelin.com/relayer/stellar) (also called Stellar Channels Service) handles gasless transaction submission. It replaces the deprecated Launchtube service and uses Stellar's native fee bump mechanism so users don't need XLM for fees.

```typescript
import * as RPChannels from "@openzeppelin/relayer-plugin-channels";

const client = new RPChannels.ChannelsClient({
  baseUrl: "https://channels.openzeppelin.com/testnet",
  apiKey: "your-api-key",
});

// Submit a smart contract call with fee sponsorship
const response = await client.submitSorobanTransaction({
  func: contractFunc,
  auth: contractAuth,
});
```

- **Testnet hosted instance**: `https://channels.openzeppelin.com/testnet` (API keys at `/gen`)
- **Production**: Self-host via Docker ([GitHub](https://github.com/OpenZeppelin/openzeppelin-relayer))
- **Stellar docs**: https://developers.stellar.org/docs/tools/openzeppelin-relayer

### Choosing between the two kits

Passkey Kit and Smart Account Kit are sibling SDKs, not successive versions. They use different on-chain authorization models, so they are **not drop-in compatible**. Pick the model that fits your app.

| Kit | Authorization model | Reach for it when |
|-----|--------------------|-------------------|
| [smart-account-kit](https://github.com/stellar/smart-account-kit) | OpenZeppelin context rules + an auth digest, on the audited [stellar-contracts](https://github.com/OpenZeppelin/stellar-contracts) account | You need context rules, thresholds, or spending-limit policies |
| [passkey-kit](https://github.com/stellar/passkey-kit) | A flat multi-signer `Signatures` map | The flat signer model covers your authorization needs |

Both are maintained. Neither README declares the other deprecated.

### Resources
- **GitHub**: https://github.com/stellar/smart-account-kit
- **OpenZeppelin Contracts**: https://github.com/OpenZeppelin/stellar-contracts
- **Passkey Kit**: https://github.com/stellar/passkey-kit (sibling SDK — see above)
