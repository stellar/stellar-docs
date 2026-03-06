import React from "react";
import Link from "@docusaurus/Link";
import type { TagModule } from "@docusaurus/utils";

type IntroContent = {
  title: string;
  description: string;
  link?: {
    label: string;
    url: string;
  };
};

const STATIC_TAG_INTROS: Record<string, IntroContent> = {
  developer: {
    title: "Developer Meetings",
    description:
      "Protocol discussions covering core network updates, ecosystem planning, and upcoming changes.",
  },
  soroban: {
    title: "Soroban Architecture",
    description:
      "Design discussions focused on Soroban smart contracts, platform capabilities, and developer tooling.",
  },
  legacy: {
    title: "Legacy Core Meetings",
    description:
      "Old SDF meetings focused on core protocol discussions, transparency, and iteration.",
  },
  community: {
    title: "Community Collaboration",
    description:
      "Discussions by or for the broader ecosystem on less technical topics with macro effects.",
  },
  spotlight: {
    title: "Spotlight Sessions",
    description:
      "Collaborative moments to highlight a particular developer, team, or project.",
  },
  tutorial: {
    title: "Tutorial Sessions",
    description: "Hands-on developer explanations, resources, and guided walkthroughs.",
  },
};

const STANDARD_TITLES: Record<string, string> = {
  "cap-1": "Bump Sequence",
  "cap-2": "Transaction level signature verification",
  "cap-3": "Asset-backed offers",
  "cap-4": "Improved Rounding for Cross Offer",
  "cap-5": "Throttling and transaction pricing improvements",
  "cap-6": "Add ManageBuyOffer Operation",
  "cap-7": "Deterministic Account Creation",
  "cap-8": "Self Identified Pre-Auth Transaction",
  "cap-9": "Linear/Exterior Immutable Accounts",
  "cap-10": "Fee Bump Account",
  "cap-11": "Relative Account Freeze",
  "cap-12": "Deterministic accounts and creatorTxID",
  "cap-13": "Change Trustlines to Balances",
  "cap-14": "Adversarial Transaction Set Ordering",
  "cap-15": "Fee Bump Transactions",
  "cap-16": "Cosigned assets: NopOp and COAUTHORIZED_FLAG",
  "cap-17": "Update LastModifiedLedgerSeq If and Only If LedgerEntry is Modified",
  "cap-18": "Fine-Grained Control of Authorization",
  "cap-19": "Future-upgradable TransactionEnvelope type",
  "cap-20": "Bucket Initial Entries",
  "cap-21": "Generalized transaction preconditions",
  "cap-22": "Invalid transactions must have no effects",
  "cap-23": "Two-Part Payments with ClaimableBalanceEntry",
  "cap-24": "Make PathPayment Symmetrical",
  "cap-25": "Remove Bucket Shadowing",
  "cap-27": "First-class multiplexed accounts",
  "cap-28": "Clear pre-auth transaction signer on failed transactions",
  "cap-29": "AllowTrust when not AUTH_REQUIRED",
  "cap-30": "Remove NO_ISSUER Operation Results",
  "cap-31": "Sponsored Reserve",
  "cap-33": "Sponsored Reserve with EphemeralSponsorshipEntry",
  "cap-34": "Preserve Transaction-Set/Close-Time Affinity During Nomination",
  "cap-35": "Asset Clawback",
  "cap-37": "Automated Market Makers",
  "cap-38": "Automated Market Makers",
  "cap-40": "Ed25519 Signed Payload Signer for Transaction Signature Disclosure",
  "cap-41": "Concurrent Transactions",
  "cap-42": "Multi-Part Transaction Sets",
  "cap-43": "ECDSA Signers with P-256 and secp256k1 Curves",
  "cap-44": "SPEEDEX - Configuration",
  "cap-45": "SPEEDEX - Pricing",
  "cap-46": "Soroban smart contract system overview",
  "cap-46-1": "WebAssembly Smart Contract Runtime Environment",
  "cap-46-2": "Smart Contract Lifecycle",
  "cap-46-3": "Smart Contract Host Functions",
  "cap-46-5": "Smart Contract Data",
  "cap-46-6": "Smart Contract Standardized Asset",
  "cap-46-7": "Fee model in smart contracts",
  "cap-46-8": "Smart Contract Logging",
  "cap-46-9": "Network Configuration Ledger Entries",
  "cap-46-10": "Smart Contract Budget Metering",
  "cap-46-11": "Soroban Authorization Framework",
  "cap-46-12": "Soroban State Archival Interface",
  "cap-48": "Smart Contract Asset Interoperability",
  "cap-49": "Smart Contract Asset Interoperability with Wrapper",
  "cap-50": "Smart Contract Interactions",
  "cap-51": "Smart Contract Host Functionality: Secp256r1 Verification",
  "cap-52": "Smart Contract Host Functionality: Base64 Encoding/Decoding",
  "cap-53": "Separate host functions to extend the TTL for contract instance and contract code",
  "cap-54": "Soroban refined VM instantiation cost model",
  "cap-55": "Soroban streamlined linking",
  "cap-56": "Soroban intra-transaction module caching",
  "cap-57": "State Archival Persistent Entry Eviction",
  "cap-58": "Constructors for Soroban Contracts",
  "cap-59": "Host functions for BLS12-381",
  "cap-60": "Update to Wasmi register machine",
  "cap-61": "Smart Contract Standardized Asset (Stellar Asset Contract) Extension: Memo",
  "cap-62": "Soroban Live State Prioritization",
  "cap-63": "Parallelism-friendly Transaction Scheduling",
  "cap-64": "Memo Authorization for Soroban",
  "cap-65": "Reusable Module Cache",
  "cap-66": "Soroban In-memory Read Resource",
  "cap-67": "Unified Asset Events",
  "cap-68": "Host function for getting executable for Address",
  "cap-69": "String/Bytes conversion host functions",
  "cap-70": "Configurable SCP Timing Parameters",
  "cap-71": "Authentication delegation for custom accounts",
  "cap-72": "Contract signers for Stellar accounts",
  "cap-73": "Allow SAC to create G-account balances",
  "cap-74": "Host functions for BN254",
  "cap-75": "Cryptographic Primitives for Poseidon/Poseidon2 Hash Functions",
  "cap-76": "P23 State Archival bug remediation",
  "cap-77": "Ability to freeze ledger keys via network configuration",
  "cap-78": "Host functions for performing limited TTL extensions",
  "cap-79": "Host functions for muxed address strkey conversions",
  "sep-1": "Stellar Info File",
  "sep-2": "Federation Protocol",
  "sep-3": "Compliance Protocol",
  "sep-4": "Tx Status Endpoint",
  "sep-5": "Key Derivation Methods for Stellar Accounts",
  "sep-6": "Deposit and Withdrawal API",
  "sep-7": "URI Scheme to facilitate delegated signing",
  "sep-8": "Regulated Assets",
  "sep-9": "Standard KYC Fields",
  "sep-10": "Stellar Authentication",
  "sep-11": "Txrep: Human-Readable Low-Level Representation of Stellar Transactions",
  "sep-12": "KYC API",
  "sep-13": "DEPOSIT_SERVER proposal",
  "sep-14": "Dynamic Asset Metadata",
  "sep-15": "Attachment Convention",
  "sep-16": "Account Transfer Permissionless Payment Protocol (@p2p)",
  "sep-17": "Issuer account funding protocol (CAP-13 Based)",
  "sep-18": "Data Entry Namespaces",
  "sep-19": "Bootstrapping Multisig Transaction Submission",
  "sep-20": "Self-verification of validator nodes",
  "sep-21": "On-chain signature & transaction sharing",
  "sep-22": "IPFS Support",
  "sep-23": "Muxed Account Strkeys",
  "sep-24": "Hosted Deposit and Withdrawal",
  "sep-26": "Non-interactive Anchor/Wallet Asset Transfer",
  "sep-28": "XDR Base64 Encoding",
  "sep-29": "Account Memo Requirements",
  "sep-30": "Recoverysigner: multi-party key management of Stellar accounts",
  "sep-31": "Cross-Border Payments API",
  "sep-32": "Asset Address",
  "sep-33": "Identicons for Stellar Accounts",
  "sep-34": "Wallet Attribution for Anchors",
  "sep-35": "Operation IDs",
  "sep-37": "Address Directory API",
  "sep-38": "Anchor RFQ API",
  "sep-39": "Interoperability Recommendations for NFTs",
  "sep-40": "Oracle Consumer Interface",
  "sep-41": "Soroban Token Interface",
  "sep-42": "Stellar Asset Lists",
  "sep-43": "Wallet Interface Standard",
  "sep-45": "Stellar Web Authentication for Contract Accounts",
  "sep-46": "Contract Meta",
  "sep-47": "Contract Interface Discovery",
  "sep-48": "Contract Interface Specification",
  "sep-49": "Upgradeable Contracts",
  "sep-50": "Non-Fungible Tokens",
  "sep-51": "XDR-JSON",
  "sep-52": "Key Sharing Method for Stellar Keys",
  "sep-53": "Sign and Verify Messages",
  "sep-54": "Ledger Metadata Storage",
  "sep-55": "Contract Build Info",
  "sep-56": "Tokenized Vault Standard",
  "sep-57": "T-REX (Token for Regulated EXchanges)",
};

const STANDARD_DESCRIPTIONS: Record<string, string> = {
  "cap-1": "Bump Sequence is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-1 explore the proposal and its implications.",
  "cap-2": "Transaction level signature verification is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-2 explore the proposal and its implications.",
  "cap-3": "Asset-backed offers is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-3 explore the proposal and its implications.",
  "cap-4": "Improved Rounding for Cross Offer is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-4 explore the proposal and its implications.",
  "cap-5": "Throttling and transaction pricing improvements is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-5 explore the proposal and its implications.",
  "cap-6": "Add ManageBuyOffer Operation is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-6 explore the proposal and its implications.",
  "cap-7": "Deterministic Account Creation is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-7 explore the proposal and its implications.",
  "cap-8": "Self Identified Pre-Auth Transaction is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-8 explore the proposal and its implications.",
  "cap-9": "Linear/Exterior Immutable Accounts is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-9 explore the proposal and its implications.",
  "cap-10": "Fee Bump Account is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-10 explore the proposal and its implications.",
  "cap-11": "Relative Account Freeze is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-11 explore the proposal and its implications.",
  "cap-12": "Deterministic accounts and creatorTxID is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-12 explore the proposal and its implications.",
  "cap-13": "Change Trustlines to Balances is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-13 explore the proposal and its implications.",
  "cap-14": "Adversarial Transaction Set Ordering is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-14 explore the proposal and its implications.",
  "cap-15": "Fee Bump Transactions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-15 explore the proposal and its implications.",
  "cap-16": "Cosigned assets: NopOp and COAUTHORIZED_FLAG is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-16 explore the proposal and its implications.",
  "cap-17": "Update LastModifiedLedgerSeq If and Only If LedgerEntry is Modified is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-17 explore the proposal and its implications.",
  "cap-18": "Fine-Grained Control of Authorization is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-18 explore the proposal and its implications.",
  "cap-19": "Future-upgradable TransactionEnvelope type is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-19 explore the proposal and its implications.",
  "cap-20": "Bucket Initial Entries is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-20 explore the proposal and its implications.",
  "cap-21": "Generalized transaction preconditions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-21 explore the proposal and its implications.",
  "cap-22": "Invalid transactions must have no effects is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-22 explore the proposal and its implications.",
  "cap-23": "Two-Part Payments with ClaimableBalanceEntry is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-23 explore the proposal and its implications.",
  "cap-24": "Make PathPayment Symmetrical is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-24 explore the proposal and its implications.",
  "cap-25": "Remove Bucket Shadowing is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-25 explore the proposal and its implications.",
  "cap-27": "First-class multiplexed accounts is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-27 explore the proposal and its implications.",
  "cap-28": "Clear pre-auth transaction signer on failed transactions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-28 explore the proposal and its implications.",
  "cap-29": "AllowTrust when not AUTH_REQUIRED is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-29 explore the proposal and its implications.",
  "cap-30": "Remove NO_ISSUER Operation Results is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-30 explore the proposal and its implications.",
  "cap-31": "Sponsored Reserve is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-31 explore the proposal and its implications.",
  "cap-33": "Sponsored Reserve with EphemeralSponsorshipEntry is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-33 explore the proposal and its implications.",
  "cap-34": "Preserve Transaction-Set/Close-Time Affinity During Nomination is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-34 explore the proposal and its implications.",
  "cap-35": "Asset Clawback is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-35 explore the proposal and its implications.",
  "cap-37": "Automated Market Makers is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-37 explore the proposal and its implications.",
  "cap-38": "Automated Market Makers is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-38 explore the proposal and its implications.",
  "cap-40": "Ed25519 Signed Payload Signer for Transaction Signature Disclosure is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-40 explore the proposal and its implications.",
  "cap-41": "Concurrent Transactions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-41 explore the proposal and its implications.",
  "cap-42": "Multi-Part Transaction Sets is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-42 explore the proposal and its implications.",
  "cap-43": "ECDSA Signers with P-256 and secp256k1 Curves is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-43 explore the proposal and its implications.",
  "cap-44": "SPEEDEX - Configuration is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-44 explore the proposal and its implications.",
  "cap-45": "SPEEDEX - Pricing is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-45 explore the proposal and its implications.",
  "cap-46": "Soroban smart contract system overview is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46 explore the proposal and its implications.",
  "cap-46-1": "WebAssembly Smart Contract Runtime Environment is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-1 explore the proposal and its implications.",
  "cap-46-2": "Smart Contract Lifecycle is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-2 explore the proposal and its implications.",
  "cap-46-3": "Smart Contract Host Functions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-3 explore the proposal and its implications.",
  "cap-46-5": "Smart Contract Data is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-5 explore the proposal and its implications.",
  "cap-46-6": "Smart Contract Standardized Asset is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-6 explore the proposal and its implications.",
  "cap-46-7": "Fee model in smart contracts is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-7 explore the proposal and its implications.",
  "cap-46-8": "Smart Contract Logging is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-8 explore the proposal and its implications.",
  "cap-46-9": "Network Configuration Ledger Entries is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-9 explore the proposal and its implications.",
  "cap-46-10": "Smart Contract Budget Metering is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-10 explore the proposal and its implications.",
  "cap-46-11": "Soroban Authorization Framework is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-11 explore the proposal and its implications.",
  "cap-46-12": "Soroban State Archival Interface is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-46-12 explore the proposal and its implications.",
  "cap-48": "Smart Contract Asset Interoperability is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-48 explore the proposal and its implications.",
  "cap-49": "Smart Contract Asset Interoperability with Wrapper is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-49 explore the proposal and its implications.",
  "cap-50": "Smart Contract Interactions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-50 explore the proposal and its implications.",
  "cap-51": "Smart Contract Host Functionality: Secp256r1 Verification is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-51 explore the proposal and its implications.",
  "cap-52": "Smart Contract Host Functionality: Base64 Encoding/Decoding is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-52 explore the proposal and its implications.",
  "cap-53": "Separate host functions to extend the TTL for contract instance and contract code is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-53 explore the proposal and its implications.",
  "cap-54": "Soroban refined VM instantiation cost model is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-54 explore the proposal and its implications.",
  "cap-55": "Soroban streamlined linking is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-55 explore the proposal and its implications.",
  "cap-56": "Soroban intra-transaction module caching is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-56 explore the proposal and its implications.",
  "cap-57": "State Archival Persistent Entry Eviction is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-57 explore the proposal and its implications.",
  "cap-58": "Constructors for Soroban Contracts is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-58 explore the proposal and its implications.",
  "cap-59": "Host functions for BLS12-381 is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-59 explore the proposal and its implications.",
  "cap-60": "Update to Wasmi register machine is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-60 explore the proposal and its implications.",
  "cap-61": "Smart Contract Standardized Asset (Stellar Asset Contract) Extension: Memo is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-61 explore the proposal and its implications.",
  "cap-62": "Soroban Live State Prioritization is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-62 explore the proposal and its implications.",
  "cap-63": "Parallelism-friendly Transaction Scheduling is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-63 explore the proposal and its implications.",
  "cap-64": "Memo Authorization for Soroban is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-64 explore the proposal and its implications.",
  "cap-65": "Reusable Module Cache is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-65 explore the proposal and its implications.",
  "cap-66": "Soroban In-memory Read Resource is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-66 explore the proposal and its implications.",
  "cap-67": "Unified Asset Events is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-67 explore the proposal and its implications.",
  "cap-68": "Host function for getting executable for Address is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-68 explore the proposal and its implications.",
  "cap-69": "String/Bytes conversion host functions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-69 explore the proposal and its implications.",
  "cap-70": "Configurable SCP Timing Parameters is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-70 explore the proposal and its implications.",
  "cap-71": "Authentication delegation for custom accounts is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-71 explore the proposal and its implications.",
  "cap-72": "Contract signers for Stellar accounts is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-72 explore the proposal and its implications.",
  "cap-73": "Allow SAC to create G-account balances is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-73 explore the proposal and its implications.",
  "cap-74": "Host functions for BN254 is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-74 explore the proposal and its implications.",
  "cap-75": "Cryptographic Primitives for Poseidon/Poseidon2 Hash Functions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-75 explore the proposal and its implications.",
  "cap-76": "P23 State Archival bug remediation is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-76 explore the proposal and its implications.",
  "cap-77": "Ability to freeze ledger keys via network configuration is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-77 explore the proposal and its implications.",
  "cap-78": "Host functions for performing limited TTL extensions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-78 explore the proposal and its implications.",
  "cap-79": "Host functions for muxed address strkey conversions is a Core Advancement Proposal (CAP) that defines changes to the Stellar core protocol. Meetings tagged CAP-79 explore the proposal and its implications.",
  "sep-1": "Stellar Info File is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-1 explore the specification and its implementation.",
  "sep-2": "Federation Protocol is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-2 explore the specification and its implementation.",
  "sep-3": "Compliance Protocol is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-3 explore the specification and its implementation.",
  "sep-4": "Tx Status Endpoint is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-4 explore the specification and its implementation.",
  "sep-5": "Key Derivation Methods for Stellar Accounts is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-5 explore the specification and its implementation.",
  "sep-6": "Deposit and Withdrawal API is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-6 explore the specification and its implementation.",
  "sep-7": "URI Scheme to facilitate delegated signing is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-7 explore the specification and its implementation.",
  "sep-8": "Regulated Assets is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-8 explore the specification and its implementation.",
  "sep-9": "Standard KYC Fields is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-9 explore the specification and its implementation.",
  "sep-10": "Stellar Authentication is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-10 explore the specification and its implementation.",
  "sep-11": "Txrep: Human-Readable Low-Level Representation of Stellar Transactions is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-11 explore the specification and its implementation.",
  "sep-12": "KYC API is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-12 explore the specification and its implementation.",
  "sep-13": "DEPOSIT_SERVER proposal is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-13 explore the specification and its implementation.",
  "sep-14": "Dynamic Asset Metadata is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-14 explore the specification and its implementation.",
  "sep-15": "Attachment Convention is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-15 explore the specification and its implementation.",
  "sep-16": "Account Transfer Permissionless Payment Protocol (@p2p) is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-16 explore the specification and its implementation.",
  "sep-17": "Issuer account funding protocol (CAP-13 Based) is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-17 explore the specification and its implementation.",
  "sep-18": "Data Entry Namespaces is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-18 explore the specification and its implementation.",
  "sep-19": "Bootstrapping Multisig Transaction Submission is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-19 explore the specification and its implementation.",
  "sep-20": "Self-verification of validator nodes is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-20 explore the specification and its implementation.",
  "sep-21": "On-chain signature & transaction sharing is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-21 explore the specification and its implementation.",
  "sep-22": "IPFS Support is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-22 explore the specification and its implementation.",
  "sep-23": "Muxed Account Strkeys is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-23 explore the specification and its implementation.",
  "sep-24": "Hosted Deposit and Withdrawal is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-24 explore the specification and its implementation.",
  "sep-26": "Non-interactive Anchor/Wallet Asset Transfer is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-26 explore the specification and its implementation.",
  "sep-28": "XDR Base64 Encoding is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-28 explore the specification and its implementation.",
  "sep-29": "Account Memo Requirements is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-29 explore the specification and its implementation.",
  "sep-30": "Recoverysigner: multi-party key management of Stellar accounts is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-30 explore the specification and its implementation.",
  "sep-31": "Cross-Border Payments API is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-31 explore the specification and its implementation.",
  "sep-32": "Asset Address is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-32 explore the specification and its implementation.",
  "sep-33": "Identicons for Stellar Accounts is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-33 explore the specification and its implementation.",
  "sep-34": "Wallet Attribution for Anchors is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-34 explore the specification and its implementation.",
  "sep-35": "Operation IDs is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-35 explore the specification and its implementation.",
  "sep-37": "Address Directory API is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-37 explore the specification and its implementation.",
  "sep-38": "Anchor RFQ API is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-38 explore the specification and its implementation.",
  "sep-39": "Interoperability Recommendations for NFTs is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-39 explore the specification and its implementation.",
  "sep-40": "Oracle Consumer Interface is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-40 explore the specification and its implementation.",
  "sep-41": "Soroban Token Interface is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-41 explore the specification and its implementation.",
  "sep-42": "Stellar Asset Lists is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-42 explore the specification and its implementation.",
  "sep-43": "Wallet Interface Standard is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-43 explore the specification and its implementation.",
  "sep-45": "Stellar Web Authentication for Contract Accounts is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-45 explore the specification and its implementation.",
  "sep-46": "Contract Meta is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-46 explore the specification and its implementation.",
  "sep-47": "Contract Interface Discovery is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-47 explore the specification and its implementation.",
  "sep-48": "Contract Interface Specification is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-48 explore the specification and its implementation.",
  "sep-49": "Upgradeable Contracts is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-49 explore the specification and its implementation.",
  "sep-50": "Non-Fungible Tokens is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-50 explore the specification and its implementation.",
  "sep-51": "XDR-JSON is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-51 explore the specification and its implementation.",
  "sep-52": "Key Sharing Method for Stellar Keys is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-52 explore the specification and its implementation.",
  "sep-53": "Sign and Verify Messages is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-53 explore the specification and its implementation.",
  "sep-54": "Ledger Metadata Storage is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-54 explore the specification and its implementation.",
  "sep-55": "Contract Build Info is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-55 explore the specification and its implementation.",
  "sep-56": "Tokenized Vault Standard is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-56 explore the specification and its implementation.",
  "sep-57": "T-REX (Token for Regulated EXchanges) is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged SEP-57 explore the specification and its implementation.",
};

function getStandardIntro(label: string): IntroContent | null {
  const normalized = label.trim();
  const standardInfo = parseStandardLabel(normalized);
  if (!standardInfo) {
    return null;
  }
  const standardTitle = STANDARD_TITLES[standardInfo.key];
  const standardDescription = STANDARD_DESCRIPTIONS[standardInfo.key];
  const standardUrl = buildStandardUrl(standardInfo);
  if (standardInfo.type === "cap") {
    return {
      title: standardTitle ? `${normalized}: ${standardTitle}` : `${normalized} Standard`,
      description:
        standardDescription ??
        `${normalized} is a Core Advancement Proposal (CAP) that defines changes to the Stellar protocol. Meetings tagged ${normalized} explore the proposal and its implications.`,
      link: {
        label: `Read ${normalized} standard`,
        url: standardUrl,
      },
    };
  }
  return {
    title: standardTitle ? `${normalized}: ${standardTitle}` : `${normalized} Standard`,
    description:
      standardDescription ??
      `${normalized} is a Stellar Ecosystem Proposal (SEP) that defines an ecosystem standard or specification. Meetings tagged ${normalized} explore the specification and its implementation.`,
    link: {
      label: `Read ${normalized} standard`,
      url: standardUrl,
    },
  };
}

function parseStandardLabel(
  label: string,
): { type: "cap" | "sep"; key: string; main: number; subparts: number[] } | null {
  const match = label.match(/^(SEP|CAP)-([0-9]+(?:-[0-9]+)*)$/i);
  if (!match) {
    return null;
  }
  const type = match[1].toLowerCase() as "cap" | "sep";
  const numericParts = match[2]
    .split("-")
    .map((part) => Number(part))
    .filter((part) => !Number.isNaN(part));
  if (!numericParts.length) {
    return null;
  }
  const [main, ...subparts] = numericParts;
  const key = `${type}-${[main, ...subparts].join("-")}`;
  return { type, key, main, subparts };
}

function buildStandardUrl(info: {
  type: "cap" | "sep";
  main: number;
  subparts: number[];
}): string {
  const prefix = info.type;
  const main = String(info.main).padStart(4, "0");
  const subparts = info.subparts.map((part) => String(part).padStart(2, "0"));
  const suffix = subparts.length ? `-${subparts.join("-")}` : "";
  const folder = info.type === "cap" ? "core" : "ecosystem";
  return `https://github.com/stellar/stellar-protocol/blob/master/${folder}/${prefix}-${main}${suffix}.md`;
}


export default function MeetingTagCard({
  tag,
}: {
  tag: TagModule;
}): React.ReactElement | null {
  const normalizedKey = tag.label.trim().toLowerCase();
  const standardIntro = getStandardIntro(tag.label);
  const intro = standardIntro ?? STATIC_TAG_INTROS[normalizedKey];

  const resolvedIntro = intro ?? {
    title: `${tag.label} Meetings`,
    description: `Meetings tagged ${tag.label}.`,
  };

  return (
    <div className="card margin-bottom--lg">
      <div className="card__body">
        <h2 className="margin-bottom--sm">{resolvedIntro.title}</h2>
        <p className="margin-bottom--sm" style={{ fontSize: "0.9rem" }}>
          {resolvedIntro.description}
        </p>
        {resolvedIntro.link && (
          <p className="margin-bottom--none" style={{ fontSize: "0.9rem" }}>
            <Link
              href={resolvedIntro.link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              {resolvedIntro.link.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
