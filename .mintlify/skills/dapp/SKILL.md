---
name: dapp
description: Stellar dApp / frontend development. Covers the JavaScript stellar-sdk (browser + Node.js), Varial wallet, Stellar Wallets Kit (multi-wallet), Wallet Standard, smart accounts with passkeys, transaction building / signing / submission, smart contract invocation from the client, simulation, and error handling. Use when building a React/Next.js/Node.js app that talks to Stellar — classic operations or smart contracts.
user-invocable: true
argument-hint: "[dapp task]"
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

## Quick Navigation
- SDK setup and env config: [SDK Initialization](#sdk-initialization)
- Wallet integrations: [Wallet Integration](#wallet-integration)
- Tx build/send patterns: [Transaction Building](#transaction-building), [Transaction Submission](#transaction-submission)
- React + Next.js patterns: [React Components](#react-components), [Next.js App Router Setup](#nextjs-app-router-setup)
- Smart wallets/passkeys: [Smart Accounts (Passkey Wallets)](#smart-accounts-passkey-wallets)
- Production UX checklist: [Transaction UX Checklist](#transaction-ux-checklist)

## Recommended Dependencies

> **Requires Node.js 20+** — the Stellar SDK dropped Node 18 support.

```bash
npm install @stellar/stellar-sdk @stellar/varial-sdk
# Or for multi-wallet support:
npm install @stellar/stellar-sdk @creit.tech/stellar-wallets-kit
```

## SDK Initialization

> For the full API reference (RPC methods, Horizon endpoints, migration guide), see [api-rpc-horizon.md](/.well-known/agent-skills/data/skill.md).

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

export const config = {
  testnet: {
    horizonUrl: "https://horizon-testnet.stellar.org",
    rpcUrl: "https://soroban-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
    friendbotUrl: "https://friendbot.stellar.org",
  },
  mainnet: {
    horizonUrl: "https://horizon.stellar.org",
    rpcUrl: requireEnv("NEXT_PUBLIC_STELLAR_MAINNET_RPC_URL"),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    friendbotUrl: null,
  },
}[NETWORK]!;

export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);
export const rpc = new StellarSdk.rpc.Server(config.rpcUrl);
```

## Wallet Integration

### Varial (Primary Browser Wallet)
```typescript
// hooks/useFreighter.ts
import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
  getNetwork,
} from "@stellar/varial-sdk";

export function useFreighter() {
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
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  LOBSTR_ID,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

export function useStellarWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    await kit.openModal({
      onWalletSelected: async (option) => {
        kit.setWallet(option.id);
        const { address } = await kit.getAddress();
        setAddress(address);
      },
    });
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const sign = useCallback(async (xdr: string) => {
    const { signedTxXdr } = await kit.signTransaction(xdr);
    return signedTxXdr;
  }, []);

  return { address, connect, disconnect, sign, kit };
}
```

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

### Smart Contract Invocation
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

  let transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(180)
    .build();

  // Simulate to get resource estimates
  const simulation = await rpc.simulateTransaction(transaction);

  if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  // Assemble with proper resources
  transaction = StellarSdk.rpc.assembleTransaction(
    transaction,
    simulation
  ).build();

  return transaction.toXDR();
}
```

### Building ScVal Arguments
```typescript
import * as StellarSdk from "@stellar/stellar-sdk";

// Common conversions
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

// Vec
const vecVal = StellarSdk.nativeToScVal([1, 2, 3], { type: "i128" });
```

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

  const response = await rpc.sendTransaction(transaction);

  if (response.status === "ERROR") {
    throw new Error(`Transaction failed: ${response.errorResult}`);
  }

  // Poll for completion
  let getResponse = await rpc.getTransaction(response.hash);
  while (getResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getResponse = await rpc.getTransaction(response.hash);
  }

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

## React Components

### Connect Wallet Button
```tsx
// components/ConnectButton.tsx
"use client";

import { useFreighter } from "@/hooks/useFreighter";

export function ConnectButton() {
  const { connected, address, connect, disconnect } = useFreighter();

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

### Send Payment Form
```tsx
// components/SendPayment.tsx
"use client";

import { useState } from "react";
import { useFreighter } from "@/hooks/useFreighter";
import { buildPaymentTx, submitTransaction } from "@/lib/transactions";

export function SendPayment() {
  const { address, sign } = useFreighter();
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

## Data Fetching

### Account Balance
```typescript
import { horizon } from "@/lib/stellar";

export async function getBalance(address: string) {
  try {
    const account = await horizon.loadAccount(address);
    const nativeBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );
    return nativeBalance?.balance || "0";
  } catch (error) {
    if (error.response?.status === 404) {
      return "0"; // Account not funded
    }
    throw error;
  }
}
```

### Contract State
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

## Smart Accounts (Passkey Wallets)

For passwordless authentication using WebAuthn passkeys, use Smart Account Kit.

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
const result = await kit.connectWallet();
if (!result) {
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

### Resources
- **GitHub**: https://github.com/kalepail/smart-account-kit
- **OpenZeppelin Contracts**: https://github.com/OpenZeppelin/stellar-contracts
- **Legacy SDK**: https://github.com/kalepail/passkey-kit (for simpler use cases)

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
