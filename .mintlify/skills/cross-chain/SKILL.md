---
name: cross-chain
description: Cross-chain interoperability for Stellar. Entry point with a rail-selection decision table and shared pitfalls, routing to three companion files — cctp.md (Circle CCTP V2, native USDC burn-and-mint between Stellar and EVM/Solana chains, domain 27, the CctpForwarder requirement for Stellar recipients), axelar.md (Axelar GMP for Soroban contracts calling contracts on other chains, and the Interchain Token Service for multichain tokens), and layerzero.md (LayerZero V2 OApp messaging with configurable DVN security, OFT omnichain tokens, and USDT0 — native USDT on Stellar). Also covers NEAR Intents (intent-based cross-chain swaps into XLM or Stellar USDC) at the routing level. Use when bridging USDC or USDT to or from Stellar, sending messages between a Stellar contract and another blockchain, making a token exist on multiple chains, or adding cross-chain swaps to an app.
user-invocable: true
argument-hint: "[cross-chain task]"
source: https://github.com/stellar/stellar-dev-skill/tree/6fe91cc072f7e9b7480c514ef130d0cc2d169323/skills
---

# Cross-Chain on Stellar

Stellar connects to other blockchains over several production rails, each built for a different job. Picking the wrong rail wastes engineering effort; picking the right one is a routing decision, not a research project. This file routes; the deep dives live alongside it — **read the file that matches the task**:

| You want to | Use | Where |
|---|---|---|
| Move **native USDC** between Stellar and an EVM chain or Solana (no wrapped assets, no liquidity pools) | Circle CCTP V2 | [CCTP V2 on Stellar — native USDC between chains](#cctp-v2-on-stellar--native-usdc-between-chains) |
| Move **native USDT** between Stellar and an EVM chain | USDT0, a LayerZero OFT | [layerzero.md](#usdt0-native-usdt-on-stellar) |
| Have a Stellar contract **call a contract on another chain**, or receive calls from one (arbitrary payloads) | Axelar GMP or LayerZero OApp | [Axelar on Stellar — GMP and Interchain Tokens](#axelar-on-stellar--gmp-and-interchain-tokens), [LayerZero V2 on Stellar — omnichain messaging, OFT, and USDT0](#layerzero-v2-on-stellar--omnichain-messaging-oft-and-usdt0) |
| Make a token — new or an existing Stellar asset — **exist on multiple chains** | Axelar ITS or LayerZero OFT | [Axelar on Stellar — GMP and Interchain Tokens](#axelar-on-stellar--gmp-and-interchain-tokens), [LayerZero V2 on Stellar — omnichain messaging, OFT, and USDT0](#layerzero-v2-on-stellar--omnichain-messaging-oft-and-usdt0) |
| **Swap any asset cross-chain** (BTC, ETH, SOL, … → XLM or Stellar USDC) without integrating a bridge yourself | NEAR Intents | [below](#near-intents-intent-based-swaps) |

Rules of thumb: if the asset is USDC and both ends are CCTP chains, CCTP is the cheapest and most direct (it burns and mints Circle-native USDC — nothing wrapped, nothing pooled). If the asset is USDT, the answer is USDT0 over LayerZero OFT — a different rail, and one whose shape changes per leg: Stellar burns and mints, while the Ethereum leg locks and unlocks canonical USDT through an OFT Adapter, so check the route's OFT mode before you describe the flow. If you need logic, not just value, on the far chain, that is message passing — two rails do it, and the [comparison at the end of layerzero.md](#choosing-between-axelar-gmp-and-layerzero-oapp) helps you pick between Axelar's shared validator security and LayerZero's app-configured DVN sets. If you control a token and want it multichain, that is ITS or OFT on the same split. If the user just wants "turn my X on chain A into Y on Stellar" and you don't want bridge plumbing at all, quote it through NEAR Intents.

## When to use this skill

- Bridging USDC between Stellar and Ethereum, Base, Arbitrum, Solana, or another CCTP-supported chain
- Bridging USDT between Stellar and an EVM chain (USDT0 over LayerZero OFT)
- Receiving bridged USDC into a Stellar account or contract (and not bricking the funds — see the forwarder warning below)
- Writing a Stellar smart contract that sends messages to or receives messages from contracts on other chains
- Deploying an interchain token, or connecting an existing Stellar asset to other ecosystems
- Adding a "deposit from any chain" or cross-chain swap flow to a wallet or dapp

## Related skills

- Trustlines, SAC deployment, asset anatomy → `/.well-known/agent-skills/assets/skill.md`
- Writing the Stellar smart contracts that send/receive messages → `/.well-known/agent-skills/smart-contracts/skill.md`
- Frontend transaction building, Varial signing, RPC submission → `/.well-known/agent-skills/dapp/skill.md`
- Watching for the destination-side mint or contract events → `/.well-known/agent-skills/data/skill.md`
- Paying AI agents (x402/MPP) rather than bridging → `/.well-known/agent-skills/agentic-payments/skill.md`

## Pitfalls shared by every rail

These bite regardless of which rail you pick. Each companion file adds rail-specific ones.

1. **Address formats do not translate.** Stellar addresses are `strkey` strings (`G…` accounts, `C…` contracts, `M…` muxed); EVM uses 20-byte hex; Solana uses base58. Every rail defines its own encoding for foreign addresses (CCTP: raw 32-byte payloads; Axelar: strings + bytes payloads). Never paste an address from one chain into a field meant for another — encode it the way the rail specifies, and validate with the SDK (`StrKey.isValidEd25519PublicKey` / `isValidContract`) before encoding.
2. **Decimals differ.** Classic Stellar assets and their SACs use 7 decimals, but other Stellar token contracts (ITS-deployed tokens included) declare their own — call `decimals()` instead of assuming. USDC is 6 on every supported chain except Stellar (which uses 7); EVM tokens are commonly 18; CCTP messages are always 6-decimal. Convert at every boundary and test with amounts that exercise the last digit (see the worked decimal examples in [cctp.md](#usdc-precision-7-decimals-vs-6)). LayerZero OFTs add a second layer: an OFT declares `shared_decimals` (6 for USDT0) alongside the token's local decimals, and **silently drops the remainder below that precision on send** — quote with `quote_oft` and trust its `OFTReceipt`, not your input amount (see [layerzero.md](#decimals-7-local-6-shared)).
3. **Classic Stellar recipients need a trustline first.** A `G…` account cannot receive an issued asset (USDC included) without a trustline to that asset. Bridged funds destined for an account without one will not land. Check and provision before starting the transfer — see `/.well-known/agent-skills/assets/skill.md`.
4. **Cross-chain is asynchronous.** Every rail has a wait: CCTP waits for finality plus Circle's attestation (seconds to ~15 minutes depending on chain and finality threshold), Axelar waits for validator confirmation, intents wait for a market maker. Build UIs and agents around polling a status, never around "submit and assume".
5. **Testnet first, always.** Do the full round-trip on testnet before touching mainnet — cross-chain mistakes are frequently unrecoverable by design (burns are final, and some misencodings permanently strand funds). Two rails cannot be rehearsed that way: NEAR Intents is filled by real market makers, and **USDT0 publishes no testnet deployment** even though LayerZero's testnet endpoint exists. For both, the rehearsal path is read-only quotes (`quote_oft` and `quote_send` for USDT0, dry quotes for intents) followed by a dust-sized real transfer. LayerZero also has a testnet endpoint (EID `40600`) you can point your own OApp or OFT at, but confirm one testnet send actually delivers before you rely on it — see the [status notes](#limitations-and-status-notes).

## NEAR Intents (intent-based swaps)

> **Status-sensitive.** Chain and asset support changes frequently — verify Stellar's current status in the [NEAR Intents docs](https://docs.near-intents.org/) before building.

[NEAR Intents](https://docs.near-intents.org/) is an intent protocol: the user states an outcome ("swap 0.1 BTC to USDC on Stellar"), market makers compete to execute it. Stellar (XLM and USDC) is a supported destination and source, which makes this the shortest path to "deposit from any chain" UX — there is no bridge contract to integrate on the Stellar side at all.

Integration is the [1Click API](https://docs.near-intents.org/near-intents/integration/distribution-channels/1click-api): `POST /v0/quote` with the asset pair returns a price and a **deposit address**; send funds there and market makers carry out the swap. `GET /v0/tokens` lists supported assets (the Stellar entries: XLM and USDC, 7-decimal), and a quote with `"dry": true` returns pricing and an ETA without creating a deposit commitment — probe pairs freely, commit later. Official SDKs exist for TypeScript, Go, and Rust.

Three Stellar-specific facts (verified against the live API):

- **Stellar deposits are MEMO mode only, and the API enforces it.** A Stellar-origin quote must set `"depositMode": "MEMO"` — without it `/v0/quote` rejects with `Incorrect depositMode for originAsset from stellar chain`. The quote then returns a deposit address **plus a memo** (`depositAddress` + `depositMemo`), and the memo is what routes your funds to your swap. A deposit without the memo is not credited — treat the memo as part of the address, and refuse to display one without the other.
- **There is no testnet.** Intents are filled by real market makers with real liquidity, so the rehearsal path is dry quotes followed by a dust-sized real swap — not a testnet round trip.
- Registering for an API key via the partners portal removes the default integrator fee; anonymous use works but is surcharged (it shows up in the quoted spread).

For anything deeper (quote parameters, slippage, refund handling), work from the live 1Click API docs rather than this file — the protocol iterates quickly.

---

# CCTP V2 on Stellar — native USDC between chains

Circle's [Cross-Chain Transfer Protocol](https://developers.circle.com/cctp) moves USDC by **burning it on the source chain and minting native USDC on the destination**. No wrapped tokens, no liquidity pools, no slippage — the amount out is the amount in minus an optional fee. Stellar is CCTP **domain 27**.

The lifecycle is always the same three steps, in both directions:

1. **Burn** on the source chain (`deposit_for_burn` / `depositForBurn`).
2. **Attest**: Circle's Iris service observes the burn and signs an attestation.
3. **Mint** on the destination chain by submitting the message + attestation.

Read this file top to bottom before writing any code: CCTP on Stellar has one mistake class that **permanently destroys funds**, and it lives in step 1 of the inbound direction.

## Contracts and addresses

Stellar CCTP runs on three Stellar smart contracts ([Circle's contract reference](https://developers.circle.com/cctp/references/stellar-contracts) is canonical):

| Contract | Role |
|---|---|
| `TokenMessengerMinter` | Burns USDC outbound (`deposit_for_burn`, `deposit_for_burn_with_hook`); mints inbound. Consolidates EVM's `TokenMessengerV2` + `TokenMinterV2`. |
| `MessageTransmitter` | Message bus: emits messages, verifies attestations, enforces nonce uniqueness (`receive_message`, `is_nonce_used`). |
| `CctpForwarder` | Receives inbound mints and atomically forwards to the real recipient (`mint_and_forward`). **Required for Stellar recipients** — see below. |

**Mainnet** (domain 27):

| Contract | Address |
|---|---|
| `TokenMessengerMinter` | `CAE2G5Z77UP7GYPYGFOWFGW7C7J6I4YP2AFGSADRKQY62SYUFLPNFTXL` |
| `MessageTransmitter` | `CACMENFFJPJMSDAJQLX4R7K3SFZIW2LJSE3R2UMLGSWHFHS353FVXAZV` |
| `CctpForwarder` | `CBZL2IH7F6BIDAA3WBNXYKIXSATJGMSW7K5P5MJ6STX5RXN47TZJDF5T` |
| USDC (SAC) | `CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75` (`USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`) |

**Testnet** (domain 27):

| Contract | Address |
|---|---|
| `TokenMessengerMinter` | `CDNG7HXAPBWICI2E3AUBP3YZWZELJLYSB6F5CC7WLDTLTHVM74SLRTHP` |
| `MessageTransmitter` | `CBJ6MTCKKZG73PMDZCJMSFRD7DQEMI4FKDH7CGDSV4W6FHCRBCQAVVJY` |
| `CctpForwarder` | `CA66Q2WFBND6V4UEB7RD4SAXSVIWMD6RA4X3U32ELVFGXV5PJK4T4VSZ` |
| USDC (SAC) | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` (`USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`) |

Derive the USDC SAC address for any network yourself rather than trusting a doc: `stellar contract id asset --asset USDC:<ISSUER> --network <net>`. Testnet USDC comes from [faucet.circle.com](https://faucet.circle.com) (pick "Stellar Testnet") — your account needs the trustline first. There is also decent USDC liquidity on the testnet DEX, so a `pathPaymentStrictReceive` from XLM often gets you a test amount without touching the faucet.

## The one rule that saves funds: use `CctpForwarder` for Stellar recipients

CCTP message fields carry **raw 32-byte address payloads** — no `strkey` type marker. The protocol therefore cannot tell a `G…` account from a `C…` contract, and it **always assumes `mintRecipient` is a contract**. Sending USDC to a Stellar user account "directly" mints into an address nobody controls.

When transferring **to** Stellar, on the source-chain burn:

- Set **both** `mintRecipient` **and** `destinationCaller` to the `CctpForwarder` address (decoded to 32 bytes).
- Put the real recipient's `strkey` (`G…`, `M…`, or `C…`) into the **hook data bytes**. There is no named field — "`forwardRecipient`" is just what the docs call that stretch of the byte layout below.

Get either field wrong and the funds are **permanently stuck — there is no recovery path**:

- Wrong `destinationCaller` → the forwarder cannot complete the transfer.
- `mintRecipient` set to a user or muxed account → USDC never reaches the forwarder.

The forwarder flow is non-custodial: `mint_and_forward(message, attestation)` verifies the message, calls `receive_message` (minting to the forwarder), and pays out to `forwardRecipient` — all in one atomic contract invocation. Any failure reverts the whole thing.

### Hook data layout

| Bytes | Type | Data |
|---|---|---|
| 0–23 | `bytes24` | Magic, Circle-reserved. All zero bytes for Stellar-inbound transfers; chains served by Circle's forwarding service use a `cctp-forward` magic instead |
| 24–27 | `uint32` (BE) | Version; set to `0` |
| 28–31 | `uint32` (BE) | `L`: length of `forwardRecipient` in bytes |
| `32..(32+L-1)` | `bytes` | the recipient `strkey` (`forwardRecipient`), UTF-8 bytes |
| `(32+L)..` | `bytes` | Optional integrator payload; omit if unused |

Builder, from [Circle's reference](https://developers.circle.com/cctp/references/stellar). The integer fields are **big-endian** — Circle's own reference builder writes them with `writeUInt32BE`. Validate the strkey before encoding; a typo here is a fund-loss bug, not a UX bug:

```typescript
import { StrKey } from "@stellar/stellar-sdk";

function buildCctpForwarderHookData(forwardRecipientStrkey: string): `0x${string}` {
  const isValid =
    StrKey.isValidEd25519PublicKey(forwardRecipientStrkey) ||
    StrKey.isValidContract(forwardRecipientStrkey) ||
    StrKey.isValidMed25519PublicKey(forwardRecipientStrkey);
  if (!isValid) throw new Error(`Invalid forward recipient: ${forwardRecipientStrkey}`);

  const recipientBytes = Buffer.from(forwardRecipientStrkey, "utf8");
  const hookData = Buffer.alloc(32 + recipientBytes.length); // bytes 0-23 stay zero (magic)
  hookData.writeUInt32BE(0, 24);                     // hook version = 0
  hookData.writeUInt32BE(recipientBytes.length, 28); // recipient byte length
  recipientBytes.copy(hookData, 32);                 // recipient strkey as UTF-8
  return `0x${hookData.toString("hex")}`;
}

// The forwarder itself is a C… contract; decode it for mintRecipient/destinationCaller:
function contractStrkeyToBytes32(strkey: string): `0x${string}` {
  if (!StrKey.isValidContract(strkey)) throw new Error(`Invalid contract strkey: ${strkey}`);
  return `0x${Buffer.from(StrKey.decodeContract(strkey)).toString("hex")}`;
}
```

## USDC precision: 7 decimals vs 6

Stellar represents USDC in **seven**-decimal subunits; every other CCTP chain uses **six**, and the `amount` in a CCTP message is **always six-decimal**. Direction determines the handling:

- **Stellar as source**: the burn debits only through the sixth decimal; the seventh digit stays in the sender's account. Bridging `0.1234567` USDC burns `0.1234560`, leaves `0.0000007` behind in the source account, and the message `amount` is `123456`.
- **Stellar as destination**: the six-decimal message amount is scaled ×10. A message `amount` of `123456` mints `0.1234560` (= `1234560` seven-decimal subunits).

Practical consequences: pass 7-decimal subunits (`i128`) to Stellar-side calls and 6-decimal units everywhere off-chain; never derive one from the other with floats; and when verifying "did the full amount arrive", compare in message units, not source-chain units.

## Stellar → EVM/Solana (outbound)

Two Stellar transactions in the plain flow — an allowance, then the burn — because `TokenMessengerMinter` pulls funds via `transfer_from`:

1. `approve` the USDC SAC with `TokenMessengerMinter` as spender. Most basic version: approve exactly the transfer amount, with a short `live_until_ledger` (current ledger + ~100 ≈ 8 minutes) so nothing lingers. If an existing allowance already covers the amount (`allowance(from, spender)`), skip this step — or collapse approve + burn into one transaction with the wrapper below.
2. Call `deposit_for_burn`. Verified argument order (Stellar):

```typescript
import { Address, Contract, TransactionBuilder, nativeToScVal, BASE_FEE } from "@stellar/stellar-sdk";

const tmm = new Contract(TOKEN_MESSENGER_MINTER);
const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
  .addOperation(
    tmm.call(
      "deposit_for_burn",
      Address.fromString(caller).toScVal(),              // the burning account; must authorize the call
      nativeToScVal(amount, { type: "i128" }),          // 7-decimal Stellar subunits
      nativeToScVal(destinationDomain, { type: "u32" }), // e.g. 0 Ethereum, 5 Solana, 6 Base, 26 Arc
      bytesN32(mintRecipient),   // 32-byte recipient: EVM address left-padded to 32; Solana: the USDC ATA's raw bytes
      Address.fromString(USDC_SAC).toScVal(),
      bytesN32(destinationCaller), // 32 zero bytes = anyone may complete the mint (permissionless)
      nativeToScVal(maxFee, { type: "i128" }),           // fee budget, 7-decimal subunits (100_000 ≈ $0.01)
      nativeToScVal(finalityThreshold, { type: "u32" }), // 1000 = Fast, 2000 = Standard
    ),
  )
  .setTimeout(60)
  .build();
// then: simulate, sign, submit (see /.well-known/agent-skills/dapp/skill.md)
```

On `finalityThreshold`: outbound-from-Stellar transfers always execute at **Standard** — Stellar finality is already effectively instant, so there is nothing for Fast to accelerate. Iris reports `finalityThresholdExecuted: 2000` even when you request `1000`, with no fast fee charged.

3. Poll Iris for the attestation (below).
4. Submit `receiveMessage(message, attestation)` on the destination chain's `MessageTransmitterV2`. With `destinationCaller` zeroed this is permissionless — anyone (the recipient, your backend, a relayer) can submit it.

Recipient encoding: for EVM, left-pad the 20-byte address to 32 bytes. For Solana, `mintRecipient` is the recipient's **USDC associated token account** (not their wallet address) as raw 32 bytes. (On Solana, as on Stellar, messenger and minter are consolidated into a single `TokenMessengerMinter` program — don't go looking for two separate contracts.)

Destination-side reference: CCTP V2 uses the **same contract addresses on every EVM chain** (one exception, EDGE — the authoritative list is [Circle's EVM contract addresses](https://developers.circle.com/cctp/evm-smart-contracts)):

| Contract | All EVM testnets | All EVM mainnets |
|---|---|---|
| `MessageTransmitterV2` — `receiveMessage(bytes message, bytes attestation)` | `0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275` | `0x81D40F21F12A8F0E3252Bccb954D722d4c464B64` |
| `TokenMessengerV2` — `depositForBurn` / `depositForBurnWithHook` | `0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA` | `0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d` |

Pass Iris's `message` and `attestation` hex to `receiveMessage` verbatim. Domain IDs are Circle-assigned — Ethereum 0, Solana 5, Base 6, Arc 26, Stellar 27; the full table is in [supported chains and domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains) (a mainnet listing covers its official testnet too).

**One-signature variant.** The two-transaction dance (approve, then burn) collapses into one Stellar transaction with a ~40-line wrapper contract, because the contract auth tree lets a single signature authorize both nested calls. From the [reference demo](https://github.com/ElliotFriend/stellar-cctp-demo) (`contracts/stellar/cctp-wrapper/`), verbatim:

```rust
pub fn approve_and_deposit(
    env: Env, caller: Address, usdc: Address, tmm: Address, amount: i128,
    destination_domain: u32, mint_recipient: BytesN<32>, destination_caller: BytesN<32>,
    max_fee: i128, min_finality_threshold: u32,
) {
    caller.require_auth();
    let expiration_ledger = (env.ledger().sequence() + 50).next_multiple_of(50);
    token::Client::new(&env, &usdc).approve(&caller, &tmm, &amount, &expiration_ledger);
    TmmClient::new(&env, &tmm).deposit_for_burn(
        &caller, &amount, &destination_domain, &mint_recipient,
        &usdc, &destination_caller, &max_fee, &min_finality_threshold,
    );
}
```

One wallet prompt, one network fee, and the allowance expires after 50–99 ledgers (the expression rounds up to the next multiple of 50) so nothing lingers.

## EVM/Solana → Stellar (inbound)

This is the direction where the [forwarder rule](#the-one-rule-that-saves-funds-use-cctpforwarder-for-stellar-recipients) applies. Prerequisite: a `G…` recipient needs a **USDC trustline** before anything can land.

1. On the source chain, call `depositForBurnWithHook` with:
   - `mintRecipient` = `CctpForwarder` (as bytes32, via the [`contractStrkeyToBytes32` helper above](#hook-data-layout))
   - `destinationCaller` = `CctpForwarder` (same value)
   - `destinationDomain` = `27`
   - `hookData` = the recipient strkey, encoded per the [hook data layout](#hook-data-layout)
   - `burnToken` = the source chain's USDC token address
   - `amount`/`maxFee` in the source chain's 6-decimal USDC units
   - `minFinalityThreshold` = `1000` (Fast) or `2000` (Standard)
2. Poll Iris for the attestation.
3. On Stellar, invoke `mint_and_forward(message: Bytes, attestation: Bytes)` on `CctpForwarder`, passing the raw message and attestation bytes from Iris. One atomic invocation validates, mints, and pays the recipient.

## Iris: polling for the attestation

```
GET https://iris-api-sandbox.circle.com/v2/messages/{sourceDomain}?transactionHash={hash}   # testnet
GET https://iris-api.circle.com/v2/messages/{sourceDomain}?transactionHash={hash}           # mainnet
```

Poll until `status` is `"complete"`, then read `message` and `attestation` (both hex). The same hosts also serve the fee schedule — `GET /v2/burn/USDC/fees/{sourceDomain}/{destDomain}` returns the `minimumFee` per finality threshold; use it to set `maxFee` instead of guessing, and to predict the exact minted amount (`amount − feeExecuted`). Field-level gotchas, all verified against live behavior:

- **Fields holding Stellar payloads return `null`.** In `decodedMessage`/`decodedMessageBody`, the API decodes EVM-address fields normally but returns `null` for fields carrying 32-byte Stellar payloads — on a Stellar→EVM leg, `sender`/`burnToken` come back `null` while `recipient`/`mintRecipient`/`destinationCaller` arrive populated; on an EVM→Stellar leg it's the reverse. The transfer is fine either way; parse the raw `message` hex if you need the Stellar-side addresses.
- **Normalize hex hashes to lowercase, but never touch Solana signatures.** Solana tx signatures are base58 and case-sensitive — lowercasing one makes Iris 404 forever. Only lowercase hashes matching `/^(0x)?[0-9a-fA-F]+$/`.
- `delayReason: "insufficient_fee"` means your `maxFee` didn't cover the Fast tier — the transfer falls back to Standard finality rather than failing.
- Attestation latency is dominated by source-chain finality: seconds on fast-finality chains, up to ~15 minutes for Standard transfers from Ethereum-derived chains. `finalityThreshold` 1000 (Fast) vs 2000 (Standard) trades fee for speed.

## Worked reference implementation

The best way to see all of this run is [**ElliotFriend/stellar-cctp-demo**](https://github.com/ElliotFriend/stellar-cctp-demo) — a SvelteKit demo that bridges testnet USDC Stellar ↔ EVM (Arc, Base Sepolia) and Stellar ↔ Solana, making every step visible on one screen: burn, attestation, mint. It is the source several snippets above were adapted from, and it's tested end-to-end on testnet in both directions.

Worth studying in the source:

| What | Where |
|---|---|
| Hook-data encoding ("the most important code in the repo" — get it wrong and funds are lost) | `src/lib/evm/cctp.ts` |
| Stellar-side burns: direct, wrapper, wrapper-with-hook | `src/lib/stellar/cctp.ts` |
| The one-signature Stellar wrapper | `contracts/stellar/cctp-wrapper/` |
| Iris polling with the hash-normalization gotcha | `src/lib/circle/iris.ts` |
| Chain/domain/address registry | `src/lib/config.ts` |
| EVM-side UX ladder: 2-tx approve, 1-tx EIP-2612 permit wrapper, 1-click EIP-5792 `wallet_sendCalls` | `src/lib/evm/cctp.ts`, `contracts/evm/cctp-wrapper/` |

To run it: `pnpm install && pnpm run dev`, Varial on Stellar Testnet + any injected EVM wallet, testnet USDC from [faucet.circle.com](https://faucet.circle.com), testnet XLM from [Stellar Lab](https://lab.stellar.org/account/fund). It defaults to Arc (Circle's L1) because attestation takes seconds there and gas is paid in USDC — the fastest feedback loop for learning the protocol.

## Limitations and status notes

- **USDC only** on Stellar CCTP today. Across CCTP as a whole, USDC is supported on every domain except BNB Smart Chain, and the only other supported token is USYC (Ethereum and BNB only) — EURC is not a CCTP token anywhere. Check [Circle's supported-tokens table](https://developers.circle.com/cctp/concepts/supported-chains-and-domains#supported-tokens) before promising an asset.
- `TokenMessengerMinter` exposes `handle_receive_unfinalized_message` (Fast Burn) at the interface level; check Circle's current Fast-transfer support matrix for Stellar before relying on sub-finality mints.
- Domains are assigned by Circle ([supported chains and domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains)); Stellar is 27, and new chains appear regularly.

---

# LayerZero V2 on Stellar — omnichain messaging, OFT, and USDT0

[LayerZero](https://docs.layerzero.network/v2/developers/stellar/overview) is an omnichain messaging protocol whose Stellar endpoint went live on mainnet in July 2026, connecting Stellar to 100+ chains. Its defining trait versus other rails: **security is per-application configurable** — each OApp chooses which DVNs (Decentralized Verifier Networks) must attest to its messages and which executor delivers them.

The rail carries production traffic today: **USDT0**, Tether's USDT delivered as a LayerZero OFT, is the first production OFT on Stellar's endpoint. If the task is "bridge USDT to or from Stellar", jump to [USDT0](#usdt0-native-usdt-on-stellar) — it is the whole answer.

> **Status-sensitive.** This is the newest rail on Stellar, and its addresses have already moved once (the testnet endpoint was redeployed during August 2026). Resolve current addresses, DVN availability, and pathway support from LayerZero's [deployed contracts page](https://docs.layerzero.network/v2/deployments/deployed-contracts) — backed by `https://metadata.layerzero-api.com/v1/metadata/deployments`, the canonical machine-readable source — before building.

## Endpoint and addresses

Verified against the LayerZero metadata API on 2026-08-27.

| | Mainnet | Testnet |
|---|---|---|
| Endpoint ID (EID) | `30600` | `40600` |
| `EndpointV2` | `CCQLLRE5JBAWYCW3KTWOIWLMFDUOKROQVZNSALQMGOSXNW3ERUOWTZGK` | `CALTBA5S6GRJEHAXFP45LGGLKWWAF7HTZCPNUBUJF2HWWRRLQNV35AIV` |
| `SendUln302` / `ReceiveUln302` | `CCV4HEII3UC65THWGSRM2DVIJLB6HS6YMUHDTTHUECX2RHTP5FA2GOBA` | `CCMLPCAWCPIIMXOHJJKU3NZLOFTT2O6QTB2UUFPN6SEHLK35QRHVKKMB` |
| `Executor` | `CCEGV7LM6X736RQBPUD4F34HBUUR7OANXLPYUEDQWTPTYX36KSPSAJYM` | `CCAVZ7ESAV3PDJ6PISRCXVZCXFFH4NGI7K7MVMZZDR33LC5AD3UPZATT` |
| `ExecutorHelper` | `CB54JXWG3X77YFAFLYQMRUIMLAEP6XUBBWVQLQYVK2CEOA6PGNQUDRAO` | `CANJCMHRRXEBM46675TSPJIFUVPW7PDOCBLMWS7QPO5TCBHBL7JC4CDL` |

Two Stellar-specific details in that data: the send and receive ULN 302 libraries **share a single contract address** on Stellar (one contract, both roles), and the remaining components — `Treasury`, `PriceFeed`, `BlockedMessageLib`, `DvnFeeLib`, `ExecutorFeeLib` — resolve from the same metadata entry rather than being hardcoded here.

**DVNs live on Stellar mainnet** (active, non-deprecated entries): LayerZero Labs, Horizen, Nethermind, Canary, and USDT0. Your OApp's security config selects which of these, and how many, must verify each message. Stellar DVN identifiers in the metadata are 32-byte hex values, not `C…` strkeys — don't try to parse one as an address.

## USDT0: native USDT on Stellar

USDT0 is USDT moved over LayerZero's OFT standard. There is no wrapped token and no pool. On Stellar it is a **classic asset** with a locked issuer whose SAC admin is a contract.

**The debit and credit shape is per leg, not global.** Stellar's deployment is a `MintBurn` OFT: it burns on send and mints on receive. Ethereum's is an **OFT Adapter** (`0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee`) over canonical Tether USDT (`0xdAC17F958D2ee523a2206206994597C13D831ec7`, confirmed by the adapter's `token()`). That leg locks and unlocks the reserve instead: a send to Ethereum unlocks USDT, and a send from Ethereum locks it, so the sender there approves the adapter first. Read the far chain's entry on the [deployments page](https://docs.usdt0.to/technical-documentation/deployments) — it says `OFT` or `OFT Adapter` — and read `oft_type()` on Stellar. Never promise burn-and-mint on both ends of a route.

| Surface | Address |
|---|---|
| Classic asset | `USDT0:GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q` |
| SAC (the OFT's `token()`) | `CBSJZEIO5C7KC2SF3MKSNXXJSW5G3VTNBX4ATMKUI3B2MR4JKM4R26YF` |
| OFT | `CBOWOLFSDM5PZXNFIVDMP5NZ7U2GSIHED6H6R446QOHF266XINKUMMF6` |
| SAC manager (mint/burn adapter, and the SAC's admin) | `CA3GUWLOS3QKN6WNRAELSUDSKLDTVTWEDJ3KLGAJG3SIWGA5L3KZYWGJ` |
| OneSig (owns the SAC manager) | `CBCZ5CETG3XR5MZVDC7QBDOTIH6P7MOLUH2SSC52J3NVBYIV45D4QKR6` |

Addresses per [USDT0's deployments page](https://docs.usdt0.to/technical-documentation/deployments), which lists the token, OFT, and OneSig. The SAC matches Horizon's own derivation for the asset, and the SAC manager is the contract the OFT mints through — confirmed from a live inbound transfer on mainnet. USDT0 is part of Everdawn Labs Limited.

### The rules that save funds

1. **An account (`G…`) recipient needs a USDT0 trustline before anything inbound lands.** A `G…` account cannot hold an issued asset without one. This is the single most common inbound failure. A contract (`C…`) recipient needs none — but only while that contract exists. SAC balances for contracts live in contract storage, not in a trustline. The OFT decides which one you get from the 32-byte recipient: it resolves to a contract address when a contract with that ID exists, and to a `G…` account otherwise. **Confirm the recipient contract is deployed before the source chain sends** — see below.
2. **Pin the code *and* the issuer.** `USDT0` is a 5-character code (`credit_alphanum12`), and asset code alone identifies nothing. Verify the SAC by derivation — `stellar contract id asset --asset USDT0:GATISXX6… --network mainnet` must return `CBSJZEIO…`.
3. **There is no `stellar.toml`.** The issuer publishes no `home_domain`, so every check keyed on `home_domain` or a SEP-1 `[[CURRENCIES]]` entry fails on a legitimate, live asset. Validate by issuer plus SAC derivation instead.
4. **Dust below 6 decimals is dropped on send** — see below.

### Decimals: 7 local, 6 shared

The SAC uses Stellar's 7 decimals. The OFT's `shared_decimals()` is **6**, the precision USDT0 uses on every chain. `decimal_conversion_rate()` is therefore `10 ^ (7 - 6)` = **10**, and the OFT removes any remainder before it builds the message. Where that remainder ends up depends on the route's OFT fee, so read `effective_fee_bps(dst_eid)` before you promise a user anything:

- **No fee on the route** (`effective_fee_bps` is `0`): send `1.0000001` USDT0 (`amount_ld` = `10000001`) and `amount_sent_ld` is `10000000`. The trailing `0.0000001` **stays in your account**. It is not lost, but it is not sent either.
- **A fee on the route** (`effective_fee_bps` above `0`): the OFT debits your full `amount_ld` instead, and the rounded remainder is absorbed into the fee rather than left behind. `amount_sent_ld` is your whole input, and `amount_received_ld` is the dust-adjusted amount after the fee.
- Fee basis points are live configuration (see the table below), so never hardcode the first case.
- Quote first and compare. `quote_oft` returns an `OFTReceipt` whose `amount_sent_ld` and `amount_received_ld` are already dust- and fee-adjusted — treat those, not your input, as the truth.
- Never derive one side from the other with floats, and test with amounts that exercise the seventh digit.

### Inbound: EVM → Stellar

1. For a `G…` recipient, the trustline must exist first (rule 1 above). A `C…` recipient needs none, but it must already be deployed on Stellar.
2. Send on the source chain against USDT0's OFT there, with Stellar's EID `30600` and the recipient as its **decoded 32-byte strkey payload** — see below.
3. LayerZero's DVNs verify, then the executor delivers. On Stellar the delivery lands as `ExecutorHelper.execute`, which sub-invokes `lz_receive` on the OFT; the OFT credits through the SAC manager (it holds `MINTER_ROLE`), which mints on the SAC.

**Encoding the recipient is the fund-critical step.** The message carries a raw 32-byte payload, and the Stellar OFT feeds it straight to `resolve_address` (`oft-core/src/utils.rs`). Decode the strkey and send **only its payload**: the Ed25519 public key for a `G…` account, the contract ID hash for a `C…` contract. Never send the strkey string itself, and never keep its version byte or its 2-byte checksum. Any of those gives the OFT 32 different bytes, which it resolves anyway: the credit either lands on an address you do not control, or fails on a missing trustline and leaves the message undelivered. **Do not copy the CCTP pattern here** — CCTP carries the recipient strkey as UTF-8 hook data ([cctp.md](#hook-data-layout)). LayerZero does not. It wants the raw payload:

```ts
import { StrKey } from "@stellar/stellar-sdk";

function stellarRecipientToBytes32(strkey: string): `0x${string}` {
  let raw;
  if (StrKey.isValidContract(strkey)) {
    raw = StrKey.decodeContract(strkey);          // C… → contract ID hash
  } else if (StrKey.isValidEd25519PublicKey(strkey)) {
    raw = StrKey.decodeEd25519PublicKey(strkey);  // G… → Ed25519 public key
  } else {
    throw new Error(`Not a G… or C… address: ${strkey}`);
  }
  return `0x${Buffer.from(raw).toString("hex")}`; // 32 bytes, no version, no checksum
}
```

**A `C…` strkey that parses is not proof the contract is there.** `StrKey.isValidContract` reads the string; `resolve_address` reads the ledger. If that contract is not deployed when the message is delivered, the OFT reads the same 32 bytes as an Ed25519 account and credits a `G…` address instead. Those bytes are a contract ID hash, so no one holds the matching secret key. That account can never sign a `changeTrust`, so it never gets a USDT0 trustline and the delivery keeps failing — while the source chain has already burned or locked the tokens. LayerZero states the assumption in `oft-core/src/utils.rs`: the sender "is expected to deploy the destination contract beforehand". Deploy it first, and confirm it on the ledger immediately before the send:

```bash
RECIPIENT="CAAAA...ABCD"   # the contract you deployed to receive USDT0

# An instance entry means the contract exists. An error means do not send.
stellar ledger entry fetch contract-data --contract "$RECIPIENT" --instance \
  --output json-formatted --network mainnet
```

Existence is read when the message is delivered, not when you send it. That gap matters twice. Never point a route at a contract you have not deployed yet. And check the instance's remaining TTL in the entry above: an instance that is archived between your send and the delivery is not live state either, so the same `G…` fallback applies. Extend it with `stellar contract extend` and leave margin for source finality, DVN verification, and executor latency.

Muxed (`M…`) addresses do not fit. An `M…` strkey decodes to 40 bytes — the `G…` key plus an 8-byte id — and the OFT reads 32. Sending the `G…` half works, but the id is gone, so a custodian loses the sub-account it routes on. Give each sub-account its own `G…` account, or credit it from your own records off the `oft_received` event. CCTP differs here: its hook data accepts an `M…` strkey directly.

Nothing on the Stellar side needs to be signed by the recipient. Watch for the `oft_received` event on the OFT — its topics are `["oft_received", guid, src_eid, to]` and its data carries `amount_received_ld`.

### Outbound: Stellar → EVM

The OFT exposes the standard OFT surface. Verified signatures (LayerZero's Stellar OFT crates, and the live mainnet `send` invocation):

```rust
// oft-core types
pub struct SendParam {
    pub dst_eid: u32,        // destination endpoint id, e.g. 30101 Ethereum
    pub to: BytesN<32>,      // EVM address left-padded to 32 bytes
    pub amount_ld: i128,     // 7-decimal Stellar subunits
    pub min_amount_ld: i128, // slippage floor, also 7-decimal
    pub extra_options: Bytes,
    pub compose_msg: Bytes,  // empty unless composing
    pub oft_cmd: Bytes,      // empty for a plain transfer
}
pub struct OFTLimit   { pub min_amount_ld: i128, pub max_amount_ld: i128 }
pub struct OFTReceipt { pub amount_sent_ld: i128, pub amount_received_ld: i128 }

// The three calls, in order
fn quote_oft(env, from: &Address, send_param: &SendParam)
    -> (OFTLimit, Vec<OFTFeeDetail>, OFTReceipt);
fn quote_send(env, from: &Address, send_param: &SendParam, pay_in_zro: bool)
    -> MessagingFee;                       // { native_fee: i128, zro_fee: i128 }
fn send(env, from: &Address, send_param: &SendParam, fee: &MessagingFee,
        refund_address: &Address) -> (MessagingReceipt, OFTReceipt);
```

Order matters: `quote_oft` tells you what will actually arrive, `quote_send` prices the message, `send` executes it. The quotes are read-only, and `send` is shown below with `--send=no` so all three simulate. Run them in that order before you ask a user to sign anything:

```bash
# --send=no simulates. The two quotes never sign; the third command would.
OFT=CBOWOLFSDM5PZXNFIVDMP5NZ7U2GSIHED6H6R446QOHF266XINKUMMF6
SENDER=$(stellar keys address alice)   # the account that pays and signs
EVM_TO=0x1234...abcd                   # the EVM recipient, 20-byte hex
TO=000000000000000000000000${EVM_TO#0x}   # left-padded to 32 bytes

# Discover with a zero floor. min_amount_ld is enforced by the quotes too,
# so a real floor here hides the answer behind SlippageExceeded.
DISCOVER='{"dst_eid":30101,"to":"'"$TO"'","amount_ld":"10000000","min_amount_ld":"0","extra_options":"","compose_msg":"","oft_cmd":""}'

# 1. What actually arrives? Returns (OFTLimit, Vec<OFTFeeDetail>, OFTReceipt).
stellar contract invoke --id "$OFT" --source-account alice \
  --network mainnet --send=no \
  -- quote_oft --from "$SENDER" --send_param "$DISCOVER"

# 2. Show the user amount_received_ld, get their floor, then rebuild the
#    parameter with it. This is the value you send with.
read -r MIN_AMOUNT                     # the user's floor, in USDT0 7-decimal units
PARAM='{"dst_eid":30101,"to":"'"$TO"'","amount_ld":"10000000","min_amount_ld":"'"$MIN_AMOUNT"'","extra_options":"","compose_msg":"","oft_cmd":""}'

# 3. Re-quote with that floor. Fee configuration is live, so this is the
#    receipt the user signs against. An error here means the route now
#    costs more than the floor: go back to the user, never to a lower floor
#    you picked yourself.
stellar contract invoke --id "$OFT" --source-account alice \
  --network mainnet --send=no \
  -- quote_oft --from "$SENDER" --send_param "$PARAM"

# 4. What does the message cost? Returns MessagingFee { native_fee, zro_fee }.
stellar contract invoke --id "$OFT" --source-account alice \
  --network mainnet --send=no \
  -- quote_send --from "$SENDER" --pay_in_zro false --send_param "$PARAM"

# 5. The send itself. NATIVE_FEE is the stroop figure step 4 returned; quote
#    it every time. Drop --send=no only when the user agreed to sign.
read -r NATIVE_FEE                     # paste the native_fee from step 4
FEE='{"native_fee":"'"$NATIVE_FEE"'","zro_fee":"0"}'

stellar contract invoke --id "$OFT" --source-account alice \
  --network mainnet --send=no \
  -- send --from "$SENDER" --send_param "$PARAM" \
     --fee "$FEE" --refund_address "$SENDER"
```

**Never discover a route with a real slippage floor.** `quote_oft` and `quote_send` both call `__debit_view`, which asserts `amount_received_ld >= min_amount_ld` and panics `SlippageExceeded` (`oft/src/oft.rs`). A route charging more than your floor then returns an error instead of a receipt, and you cannot tell an expensive route from a broken one. Quote with `0`, show the user what arrives, and re-run both quotes with their floor immediately before `send`. `min_amount_ld` is a USDT0 amount in the token's 7 decimals. The messaging fee is XLM in stroops. They are different units — never carry a number from one into the other.

**Two fees, two denominations. Do not confuse them.**

- **The LayerZero messaging fee is XLM.** `quote_send` returns a `MessagingFee`; `native_fee` is XLM in stroops, and `send` transfers it to the endpoint through the native SAC. It tracks the destination route, the DVN set, and executor pricing, so quote every send and never reuse a number from a previous one. `refund_address` receives any excess.
- **The OFT fee, when one is configured, is charged in USDT0 itself.** If `effective_fee_bps(dst_eid)` is above `0`, `send` transfers that share of the token to the OFT's fee deposit address, and `quote_oft` reports it as an `OFTFeeDetail` and a lower `amount_received_ld`. So a sender may need XLM *and* more USDT0 than the amount that arrives. Read `effective_fee_bps(dst_eid)` for the route in hand instead of assuming the rate is zero.

One transaction does the whole outbound leg: `send` burns `amount_received_ld` on the SAC, transfers any OFT fee, and pays the messaging fee inside a single auth tree, so the sender signs once.

### State you must read live, never hardcode

Peers, pause state, fee basis points, and rate limits are configuration. They change without notice, and a stale copy in a prompt is a failed transfer.

| Question | Call |
|---|---|
| Is this pathway wired up? | `peer(eid)` → `Option<BytesN<32>>`; `None` means no route |
| Is the OFT halted? | `is_paused()` |
| Is a fee charged on this route? | `default_fee_bps()`, `fee_bps(dst_eid)`, `effective_fee_bps(dst_eid)` |
| Will my amount fit the throttle? | `rate_limit_config(direction, eid)`, `rate_limit_capacity(direction, eid)` — `direction` is `Inbound` or `Outbound` |
| What mode is the OFT in? | `oft_type()` → `MintBurn(<SAC manager>)` for USDT0; the alternative is `LockUnlock` |

Storage keys mirror these names (`Peer(eid)`, `FeeBps(eid)`, `RateLimit(direction, eid)`, `EnforcedOptions(eid, msg_type)`), so `stellar ledger entry fetch contract-data --contract "$OFT" --key-xdr "$KEY"` reads them without any invocation at all.

Pathway coverage grows: mainnet traffic in late August 2026 already spanned Ethereum (`30101`), Polygon (`30109`), Arbitrum (`30110`) and several more in both directions. Resolve the destination with `peer(eid)` for the route the user actually asked for.

### Tracking a transfer

[LayerZero Scan](https://layerzeroscan.com) follows a message end to end — source transaction, DVN verification, destination delivery — on both networks. It is the equivalent of polling Iris in the CCTP flow. Timing is driven by source-chain finality plus DVN and executor latency: minutes, in practice. Don't promise a number.

### Limitations and status notes

- **No USDT0 testnet deployment.** USDT0's deployments page lists no Stellar testnet entry (checked 2026-08-27), so a testnet round trip of USDT0 itself is not available. The rehearsal path is therefore read-only `quote_oft` and `quote_send` simulation, then a **dust-sized real mainnet transfer** — that transfer is how you prove the flow. Do it before you move a user's balance, and match the ["testnet first" rule](#pitfalls-shared-by-every-rail).
- **A testnet rehearsal needs one explicit step.** Verified 2026-09-04 on the redeployed testnet endpoint, with a fresh OApp built from the skeleton below: the **default** send configs for EIDs `40161` and `40102` still name a deprecated DVN that rejects the registered ULN, so an out-of-the-box `send` fails with `#1213 UnsupportedMessageLib` — after the executor fee event, and `quote` succeeds misleadingly first. The fix is the per-OApp security config this rail is built around: read the active DVN address from the metadata API, then call `endpoint.set_config` (`config_type` `2`, the send ULN config) naming it in `required_dvns`. With that one config transaction, the same `send` succeeds and the endpoint emits `PacketSent` ([sample transaction](https://stellar.expert/explorer/testnet/tx/9d0d471b90a5c94143bb8dd09dc803fa731145a9891fd2338bec706d6fd7cea4)). Re-check the defaults before shipping — LayerZero may fix them, and this file records 2026-09-04.
- Fee basis points, rate limits, and the pause flag are live configuration — see the table above.
- Anything deeper on deployment and wiring belongs to the [Stellar OFT docs](https://docs.layerzero.network/v2/developers/stellar/oft/overview) and the [OFT standard](https://docs.layerzero.network/v2/concepts/applications/oft-standard).

## OApp: the Soroban contract pattern

Source of truth: [LayerZero-Labs/monorepo-external](https://github.com/LayerZero-Labs/monorepo-external) — the protocol contracts (`contracts/protocol/stellar/`), the OApp packages (`apps/oapp-app/contracts/stellar/`), the OFT and SAC-manager contracts (`apps/oft-app/contracts/stellar/`), and the worked reference at `apps/project-types/omni-counter-app/contracts/stellar/`. There is no Stellar package in the public `LayerZero-v2` repo and no LayerZero Stellar crate on crates.io — work from this monorepo.

Every import path, argument order, and trait signature below was read out of that monorepo at commit `3f1cf3adadca88aa7a4ee5a7ee251c8b7fefcf2f` (2026-08-26), whose `rust-toolchain.toml` pins Rust `1.90.0` and the `wasm32v1-none` target. Pin the same revision when you copy it, because these crates are not versioned on crates.io.

This exact snippet was compiled on 2026-09-04 against the monorepo at the pinned commit (Rust `1.90.0`, target `wasm32v1-none`): a 45 kB wasm whose exported interface includes `lz_receive`, `quote`, `send`, `set_peer`, and the full generated OApp surface. Two things the build needs that the snippet cannot carry: the crate must start with `#![no_std]` (the target has no std; without the attribute the build fails with `E0463: can't find crate for std`), and a standalone copy must pin `soroban-sdk-macros = "=25.1.1"` and lock `soroban-spec`/`soroban-spec-rust` to `25.1.1` — soroban-sdk `25.1.1` declares caret ranges, so a fresh lockfile resolves those to `25.3.x`, which requires a newer rustc than the monorepo's pinned `1.90.0`.

```rust
#![no_std]
use common_macros::{contract_impl, lz_contract};
use endpoint_v2::{MessagingFee, Origin};
use oapp::{
    oapp_core::{init_ownable_oapp, OAppCore},
    oapp_receiver::{LzReceiveInternal, OAppReceiver},
    oapp_sender::{FeePayer, OAppSenderInternal},
};
use oapp_macros::oapp;
use soroban_sdk::{Address, Bytes, BytesN, Env};

#[lz_contract]
#[oapp]
pub struct MyOApp;

#[contract_impl]
impl MyOApp {
    pub fn __constructor(env: &Env, owner: &Address, endpoint: &Address, delegate: &Address) {
        init_ownable_oapp::<Self>(env, owner, endpoint, delegate);
    }

    // Fee estimation: always quote before sending.
    pub fn quote(env: &Env, dst_eid: u32, message: &Bytes, options: &Bytes, pay_in_zro: bool) -> MessagingFee {
        Self::__quote(env, dst_eid, message, options, pay_in_zro)
    }

    pub fn send(env: &Env, caller: &Address, dst_eid: u32, message: &Bytes, options: &Bytes, fee: &MessagingFee) {
        caller.require_auth();
        // FeePayer::Verified marks the caller as already authorized, so the
        // send path doesn't trigger a second require_auth in Soroban's auth tree.
        Self::__lz_send(env, dst_eid, message, options, &FeePayer::Verified(caller.clone()), fee, caller);
    }
}

impl LzReceiveInternal for MyOApp {
    fn __lz_receive(
        env: &Env,
        origin: &Origin,          // src_eid, sender (bytes32), nonce
        guid: &BytesN<32>,
        message: &Bytes,
        _extra_data: &Bytes,
        _executor: &Address,
        value: i128,
    ) {
        // Your logic. The generated lz_receive has already validated the peer
        // and cleared the payload on the endpoint before this runs.
    }
}
```

The shape rhymes with Axelar's derive pattern, and the same division of labor applies:

- The `#[oapp]` macro generates the public surface (`OAppCore`, sender internals, the `lz_receive` entrypoint, options handling). The generated `lz_receive` does peer validation and `endpoint.clear()` **before** dispatching to your `__lz_receive` — don't reimplement either.
- **`custom = [receiver]` is a footgun.** Passing `#[oapp(custom = [receiver])]` tells the macro to *skip* generating the receiver surface; unless you then supply your own `#[contract_impl(contracttrait)] impl OAppReceiver` (as the counter example does, to customize `next_nonce`), the contract **compiles cleanly but exports no `lz_receive` at all** — an OApp that silently cannot receive. Use plain `#[oapp]` unless you're deliberately taking that surface over.
- **Peers must be set on both sides.** `set_peer(&dst_eid, &Some(remote_oapp_bytes32), &caller)` on Stellar, and the mirror call on the destination OApp. A message from an unset peer never reaches `__lz_receive`.
- **Fees are quoted, then paid — in XLM, or in ZRO.** Quote with `__quote(dst_eid, message, options, pay_in_zro)` into a `MessagingFee { native_fee, zro_fee }` and pass that value to `__lz_send`; underquoting fails the send. `__lz_send` pays ZRO whenever `fee.zro_fee` is not `0`. Both steps need a ZRO token set on the endpoint (`zro()` → `Option<Address>`), and **they fail in different places with different errors**:
  - `__quote` with `pay_in_zro = true` reaches the endpoint, which panics `EndpointError::ZroUnavailable`.
  - `__lz_send` with a non-zero `zro_fee` never reaches the endpoint. `__pay_zro` runs first and panics `OAppError::ZroTokenUnavailable`.

  Don't match on the wrong one. Pass `pay_in_zro = false` unless you read a ZRO token on the endpoint you use.
- **Auth is Soroban-native.** `require_auth()` replaces EVM's `msg.sender` checks throughout, and `FeePayer::{Verified, Unverified}` exists specifically to avoid double-auth in the auth tree.
- The counter example additionally shows **ordered-nonce enforcement** (`origin.nonce` bookkeeping plus the endpoint's `skip`), **composed messages** (`send_compose` for A→B→C flows), and an **ABA round-trip** (receive triggers a send back) — read it before designing anything stateful.

## OFT: omnichain tokens of your own

OFT is LayerZero's token standard, the analogue of Axelar's ITS. The Stellar contracts live at `apps/oft-app/contracts/stellar/` in the monorepo, in three pieces worth knowing apart:

- `oft-core` — the shared logic: decimal conversion, `quote_oft`/`quote_send`/`send`, message building.
- `oft` — the deployable contract, with the `pausable`, `oft_fee`, and `rate_limiter` extensions bolted on.
- `sac-manager` — the piece that makes an **existing classic Stellar asset** work as a MintBurn OFT. It becomes the SAC's admin and forwards `mint`, `clawback`, `set_authorized`, and `set_admin` under role gates (`MINTER_ROLE`, `CLAWBACK_ROLE`, `BLACKLISTER_ROLE`, `ADMIN_MANAGER_ROLE`). This is exactly the USDT0 arrangement.

One hard prerequisite from the SAC-manager design: **the issuer account must be locked** (master key weight `0`). Payments from a classic issuer are minting, so an unlocked issuer can bypass the role model entirely and the trust story collapses. Lock it *after* `set_admin` hands the SAC to the manager, never before: the issuer is the SAC's first admin, and only it can authorize that first handover. USDT0's issuer is locked. Verify that before you trust any contract-administered classic asset — see `/.well-known/agent-skills/assets/skill.md`.

## Choosing between Axelar GMP and LayerZero OApp

Both move arbitrary payloads between Stellar contracts and other chains; neither is strictly better.

- **Security model**: Axelar messages are verified by its proof-of-stake validator network — one shared model for everyone. LayerZero lets each application pick its own DVN set — more control, and more responsibility (a weak DVN config is your problem).
- **Token standard**: existing Stellar assets connect via Axelar's canonical ITS registration, or via an OFT with a SAC manager as above. New multichain tokens work well in either.
- **Track record on Stellar**: Axelar's Stellar contracts have been live longer; LayerZero's endpoint arrived in July 2026 but now carries production USDT0 traffic. Coverage differs too — check each protocol's chain list for the chains you actually need.
- **Ecosystem gravity**: if your team already runs OApps or ITS integrations elsewhere, staying on that stack usually beats mixing rails.

---

# Axelar on Stellar — GMP and Interchain Tokens

[Axelar](https://docs.axelar.dev/) connects Stellar to EVM chains and the wider Axelar ecosystem through its amplifier stack. Two products matter here:

- **GMP (General Message Passing)** — a Stellar smart contract sends arbitrary payloads to a contract on another chain, or receives and executes payloads from one.
- **ITS (Interchain Token Service)** — tokens that exist on multiple chains: mint new ones, or connect an existing Stellar token.

Both are live on Stellar testnet and mainnet. The Stellar contracts are Rust smart contracts and live in [axelar-amplifier-stellar](https://github.com/axelarnetwork/axelar-amplifier-stellar) — `stellar-axelar-gateway`, `stellar-axelar-gas-service`, and the ITS contracts. Every signature in this file is checked against those sources, which occasionally run ahead of the docs site; when they disagree, the source wins.

> **Addresses and chain names:** resolve the current Gateway, Gas Service, and ITS addresses from [`axelar-chains-config/info/mainnet.json`](https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/mainnet.json) / [`testnet.json`](https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json) in the axelar-contract-deployments repo — the [docs directory](https://docs.axelar.dev/resources/contract-addresses/mainnet/) is built from it but doesn't always render every chain. Chain **names** are deployment-versioned too: the same file's `axelarId` is the exact string `destination_chain` wants (Stellar is `stellar` on mainnet but currently `stellar-2026-q1-2` on testnet). Don't hardcode either from any tutorial, including this one.

## GMP: sending a message from Stellar

Two calls, in order — gas first, then the message. Cross-chain execution is paid up front on the source chain.

**1. Pay gas** on the Gas Service. The `token` parameter is a struct of `{ address, amount }` — which token you're paying with and how much:

```rust
fn pay_gas(
    env: Env,
    sender: Address,
    destination_chain: String,
    destination_address: String,
    payload: Bytes,
    spender: Address,
    token: Token,
    metadata: Bytes,
) -> Result<(), ContractError>;
```

**2. Call the Gateway** with the same chain/address/payload triple:

```rust
pub fn call_contract(
    env: Env,
    caller: Address,
    destination_chain: String,
    destination_address: String,
    payload: Bytes,
);
```

Notes that save debugging time:

- In `pay_gas`, `sender` is the address that will make the follow-up `call_contract` call (from a contract, `env.current_contract_address()`); `spender` is who pays. Getting `sender` wrong orphans the gas payment from the message.
- `destination_chain` is Axelar's registered chain name (a string), not a chain ID — take the exact spelling from the `axelarId` field in the chains-config file above. A misspelled (or outdated) chain name fails downstream, not at call time.
- `destination_address` is a string in the destination chain's own format (for EVM, the `0x…` hex address).
- `payload` is raw `Bytes`. Axelar does not define the codec — you do. For EVM counterparties the convention is ABI encoding, so encode/decode with an ABI library on both ends and version your payload format from day one.
- Gas is paid in XLM through the native-asset SAC (derive its address: `stellar contract id asset --asset native --network <net>`). Underpaid gas strands the message until topped up; overpayment is refundable through the Gas Service, but don't budget around a prompt automatic refund.
- Estimate gas and track delivery through the Axelarscan GMP API — `https://api.gmp.axelarscan.io` (mainnet) / `https://testnet.api.gmp.axelarscan.io` (testnet): `POST` `{"method": "estimateGasFee", …}` to price the cross-chain leg, `{"method": "searchGMP", …}` to poll a message's status by tx hash.
- Delivery times are asymmetric: Stellar → EVM executes in under a minute, but EVM-L2 → Stellar first waits out the L2's **L1 finality** (~25–30 minutes on testnet). A message sitting unexecuted that long is normal, not stuck — check `searchGMP` before topping up gas.

## GMP: receiving a message on Stellar

Do **not** hand-implement the executable interface — the source marks it "DO NOT IMPLEMENT THIS MANUALLY!". The supported pattern is the `AxelarExecutable` derive macro plus a `CustomAxelarExecutable` impl with two functions: `__gateway` (which gateway to trust) and `__execute` (your logic). The macro generates the public `execute` entrypoint and **guarantees the gateway's `validate_message` has already succeeded** before `__execute` runs. Verbatim from Axelar's own [example contract](https://github.com/axelarnetwork/axelar-amplifier-stellar/tree/main/contracts/stellar-axelar-example):

```rust
use stellar_axelar_gateway::executable::{AxelarExecutableInterface, CustomAxelarExecutable};
use stellar_axelar_std::AxelarExecutable;

#[contract]
#[derive(AxelarExecutable)]
pub struct AxelarExample;

impl CustomAxelarExecutable for AxelarExample {
    type Error = AxelarExampleError;

    fn __gateway(env: &Env) -> Address {
        storage::gateway(env)
    }

    fn __execute(
        env: &Env,
        source_chain: String,
        message_id: String,
        source_address: String,
        payload: Bytes,
    ) -> Result<(), Self::Error> {
        // your logic — the message is already gateway-validated here
        Ok(())
    }
}
```

Two compile-verified requirements the example doesn't spell out: `AxelarExecutableInterface` must be in scope (the derive-generated code references it — omitting the import fails with E0405), and your error enum must define a `NotApproved` variant, because the generated `execute` maps the gateway's validation failure onto it. Two more live in Cargo.toml: the derive macro only exists behind a feature flag — `stellar-axelar-std = { version = "…", features = ["derive"] }` — and consuming the gateway/gas-service crates as dependencies requires their `library` feature (e.g. `stellar-axelar-gateway = { version = "…", features = ["library"] }`). The example contract's own Cargo.toml in the amplifier repo is the reference for current versions.

Under the hood the generated `execute` calls the Gateway's `validate_message`, which authenticates the exact message (chain, id, sender, payload hash) and flips it to executed so it cannot replay:

```rust
fn validate_message(
    env: Env,
    caller: Address,          // must be the message's intended destination contract
    source_chain: String,
    message_id: String,
    source_address: String,
    payload_hash: BytesN<32>,
) -> bool;
```

One thing the macro does **not** do for you: check `source_chain`/`source_address` against an allowlist of counterpart contracts you trust. Axelar authenticates *that* the message came from that sender, not *whether* you should listen to them — do that check first thing in `__execute`.

Axelar's [Stellar GMP guide](https://docs.axelar.dev/dev/general-message-passing/stellar-gmp/intro/), the worked [GMP example docs](https://docs.axelar.dev/dev/general-message-passing/stellar-gmp/gmp-example/), and the `stellar-axelar-example` contract are the scaffolding starting points. The same example also shows `#[derive(InterchainTokenExecutable)]` + `CustomInterchainTokenExecutable` — the receiving-side hook for ITS transfers that carry a data payload.

## ITS: tokens on multiple chains

ITS on Stellar operates in **hub mode**: token messages route through Axelar's ITS Hub rather than chain-to-chain. Components: the `InterchainTokenService` contract (coordination), a `TokenManager` per token (mint/burn/lock), and `InterchainToken` (a Stellar token interface implementation — meaning ITS-deployed tokens are Stellar smart contracts, addressable like any `C…` token).

**Mint a new multichain token** — deploy locally, then extend it to each destination chain (each remote deployment pays its own gas):

```rust
fn deploy_interchain_token(
    env: &Env, deployer: Address, salt: BytesN<32>,
    token_metadata: TokenMetadata, initial_supply: i128, minter: Option<Address>,
) -> Result<BytesN<32>, ContractError>;   // returns the token_id

fn deploy_remote_interchain_token(
    env: &Env, caller: Address, salt: BytesN<32>,
    destination_chain: String, gas_token: Option<Token>,
) -> Result<BytesN<32>, ContractError>;
```

**Connect an existing Stellar token** (canonical registration) — works for any Stellar token, SACs of classic assets included. Anyone can deploy the trustless canonical representation to a trusted chain. Naming quirk from the source: if the token name exceeds 32 characters the symbol is used as the name, and natively issued Stellar assets always deploy with the symbol as the name:

```rust
fn register_canonical_token(
    env: &Env, token_address: Address,
) -> Result<BytesN<32>, ContractError>;

fn deploy_remote_canonical_token(
    env: &Env, token_address: Address, destination_chain: String,
    spender: Address, gas_token: Option<Token>,
) -> Result<BytesN<32>, ContractError>;
```

**Move tokens** — one call, addressed by the `token_id` the deploy/registration returned:

```rust
fn interchain_transfer(
    env: &Env, caller: Address, token_id: BytesN<32>,
    destination_chain: String, destination_address: Bytes, amount: i128,
    metadata: Option<Bytes>, gas_token: Option<Token>,
) -> Result<(), ContractError>;
```

`destination_address` is `Bytes` in the destination chain's format; `metadata` optionally triggers contract execution on arrival (GMP piggybacked on a token transfer — the receiver implements `InterchainTokenExecutable`); `gas_token` prepays the cross-chain leg.

**Operational controls** — per-token rate limits, worth setting for anything with real value. Callable by the contract operator and by per-token approved flow limiters:

```rust
fn set_flow_limit(
    env: &Env, caller: Address, token_id: BytesN<32>, flow_limit: Option<i128>,
) -> Result<(), ContractError>;
fn flow_limit(env: &Env, token_id: BytesN<32>) -> Option<i128>;
fn flow_out_amount(env: &Env, token_id: BytesN<32>) -> i128;   // current-epoch outflow
fn flow_in_amount(env: &Env, token_id: BytesN<32>) -> i128;
```

## ITS pitfalls

- **`token_id` is the identity, not the address.** The same token has different contract addresses per chain but one `BytesN<32>` token id — persist the id, derive addresses from it.
- **Decimals don't auto-reconcile across ecosystems.** Classic-asset SACs are 7-decimal, but a canonical registration accepts any Stellar token contract, and ITS tokens carry whatever `TokenMetadata` declared — read `decimals()` from the token instead of assuming 7, and think through amount scaling before wiring UIs to EVM counterparts (test a dust-sized transfer first).
- **Remote deployments and transfers both prepay gas** via `gas_token` — budget one gas payment per destination chain, not one total.
- **Flow limits fail closed.** A transfer that would exceed the window's limit is rejected, not queued — surface that error distinctly from "bridge is broken".

Full walkthroughs: Axelar's [Stellar ITS guide](https://docs.axelar.dev/dev/send-tokens/stellar/intro/).
