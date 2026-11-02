---
name: standards
description: Stellar standards, ecosystem, and reference. Covers SEPs (Stellar Ecosystem Proposals), CAPs (Core Advancement Proposals), and a quick map for picking the right standard for wallets, anchors, payments, deposits/withdrawals, federation, deep links, and KYC. Also bundles ecosystem references (DeFi protocols, dev tools, wallets, infra, community projects) and curated documentation links. Use when you need to know which SEP applies, or want a starting point for ecosystem integrations and official docs.
user-invocable: true
argument-hint: "[standards or ecosystem lookup]"
---

# Standards, Ecosystem, and Resources

Three things bundled because they're all reference material you reach for in the same moment: "which standard handles X?", "is there an existing project doing Y?", and "where's the canonical doc for Z?".

## When to use this skill
- Picking the right SEP for an integration (anchors, deposits, federation, deep links, KYC, paths)
- Checking CAP status for a protocol feature you want to rely on
- Finding existing DeFi protocols, wallets, or infrastructure to integrate with rather than rebuild
- Locating official docs, SDKs, or community resources

## Related skills
- Implementing a SEP-41 token interface → `/.well-known/agent-skills/assets/skill.md`, `/.well-known/agent-skills/smart-contracts/skill.md`
- Frontend SEP-7 / SEP-10 flows → `/.well-known/agent-skills/dapp/skill.md`
- CAPs for cryptography (BLS, BN254, Poseidon) → `/.well-known/agent-skills/zk-proofs/skill.md`
- x402/MPP protocol context → `/.well-known/agent-skills/agentic-payments/skill.md`

---

# Part 1: SEP / CAP Standards Reference


## When to use this guide
Use this when you need:
- The right SEP/CAP for a feature or integration
- Interoperability guidance for wallets, anchors, and contracts
- A fast map from use case to official standards docs

## Maintenance note
Standards status can change quickly.
Before implementation, verify current status in:
- SEPs: [stellar-protocol/ecosystem](https://github.com/stellar/stellar-protocol/tree/master/ecosystem)
- CAPs: [stellar-protocol/core](https://github.com/stellar/stellar-protocol/tree/master/core)

Treat this file as a routing map, not a source of final governance/status truth.

## High-value SEPs for app developers

### Contracts and token interfaces
- [SEP-0041](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md): Soroban token interface
- [SEP-0046](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0046.md): Contract metadata in Wasm
- [SEP-0048](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0048.md): Contract interface specification
- [SEP-0049](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0049.md): Upgradeable-contract guidance
- [SEP-0050](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0050.md): NFT standard work
- [SEP-0055](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md): Contract build verification
- [SEP-0056](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0056.md): Vault-style tokenized products
- [SEP-0057](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0057.md): Regulated token patterns (T-REX)

### Auth, identity, and metadata
- [SEP-0010](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md): Web authentication
- [SEP-0023](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md): StrKey encoding
- [SEP-0001](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md): `stellar.toml`

### Anchor and fiat integration
- [SEP-0006](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md): Programmatic deposit/withdrawal API
- [SEP-0024](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md): Hosted interactive anchor flow
- [SEP-0031](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md): Cross-border payment flow
- [SEP-0012](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md): KYC data exchange

## High-value CAPs for smart contract developers

### Smart contract foundations
- [CAP-0046](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046.md): Soroban overview
- CAP-0046 subdocuments (`cap-0046-*.md`): runtime, lifecycle, host functions, storage, auth, metering

### Frequently used contract capabilities
- [CAP-0051](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0051.md): secp256r1 verification (passkey-related cryptography)
- [CAP-0053](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0053.md): TTL extension behavior
- [CAP-0058](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0058.md): constructors (`__constructor`)
- [CAP-0059](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0059.md): BLS12-381 primitives
- [CAP-0067](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0067.md): protocol/runtime improvements including asset/event model changes

### Newer and draft crypto/features
- [CAP-0074](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md): BN254 host functions proposal
- [CAP-0075](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md): Poseidon/Poseidon2 proposal
- [CAP-0079](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0079.md): muxed-address strkey conversion proposal

Use the CAP preamble status fields as the source of truth for implementation readiness.

## Quick mapping by use case

### I am building a fungible token
1. Start with SEP-0041 interface expectations.
2. Prefer Stellar Assets + SAC interop unless custom logic is required.
3. If regulated, review SEP-0057 patterns.

### I need upgrade-safe contracts
1. Read SEP-0049 guidance for upgrade process design.
2. Use CAP-0058 constructors for atomic initialization where protocol support exists.
3. Add migration/versioning strategy before deploying upgradeable contracts.

### I am building a smart-wallet flow
1. Use SEP-0010 for web authentication flows.
2. Review CAP-0051 for passkey-related cryptographic primitives.
3. Align wallet UX and signing payloads with current SDK guidance.

### I need anchor integration for fiat rails
1. SEP-0006 for API-first flows.
2. SEP-0024 for hosted interactive rails.
3. SEP-0031 when supporting payment corridors.
4. SEP-0012 for KYC data requirements.

## Practical workflow for AI agents
- Step 1: Identify feature category (token, wallet auth, anchor, upgradeability).
- Step 2: Link user to the 1-3 primary SEP/CAP docs.
- Step 3: Check status/acceptance in the source repo before asserting support.
- Step 4: Implement only what is active on the target network/protocol.
- Step 5: Document dependencies on draft standards explicitly.

## Related docs
- Contract implementation details: [`/.well-known/agent-skills/smart-contracts/skill.md`](/.well-known/agent-skills/smart-contracts/skill.md)
- Advanced architecture guidance: [`/.well-known/agent-skills/smart-contracts/skill.md#development-patterns`](/.well-known/agent-skills/smart-contracts/skill.md#development-patterns)
- RPC and data access: [`/.well-known/agent-skills/data/skill.md`](/.well-known/agent-skills/data/skill.md)
- Security considerations: [`/.well-known/agent-skills/smart-contracts/skill.md#security`](/.well-known/agent-skills/smart-contracts/skill.md#security)

---

# Part 2: Stellar Ecosystem


This guide catalogs the major projects, protocols, and tools in the Stellar ecosystem. Use this as a reference when building on Stellar to find relevant integrations, examples, and community projects.

> **Canonical directories** — For the most up-to-date project lists, check:
> - [Stellar Ecosystem](https://stellar.org/ecosystem) — Official directory (searchable by country, asset, category)
> - [SCF Projects](https://communityfund.stellar.org/projects) — Funded projects with status tracking
> - [Stellar on DefiLlama](https://defillama.com/chain/stellar) — Live DeFi TVL data
>
> Treat project metrics/status as volatile. Validate latest activity and production readiness before taking dependencies.

## DeFi Protocols

### Lending & Borrowing

#### Blend Protocol
Universal liquidity protocol enabling permissionless lending pools.
- **Use Case**: Lending, borrowing, yield generation
- **GitHub**: https://github.com/blend-capital/blend-contracts
- **GitHub (v2)**: https://github.com/blend-capital/blend-contracts-v2
- **Integrations**: Meru, Airtm, Lobstr, DeFindex, Beans

#### Slender
First non-custodial lending protocol on Stellar with flash loan support.
- **Use Case**: Lending, borrowing, flash loans
- **Features**: Pool-based strategy, sTokens, dTokens, utilization caps
- **Oracle**: SEP-40 compatible (Reflector)

### DEXs & AMMs

#### Soroswap
First DEX and aggregator on Stellar.
- **Use Case**: Token swaps, liquidity provision, aggregation
- **Website**: https://soroswap.finance
- **GitHub (Core)**: https://github.com/soroswap/core
- **GitHub (Frontend)**: https://github.com/soroswap/frontend
- **GitHub (Aggregator)**: https://github.com/soroswap/aggregator
- **Docs**: https://docs.soroswap.finance
- **Features**: AMM + DEX aggregator across Aqua, Phoenix, Stellar Classic DEX

#### Aquarius / AQUA Network
Governance-driven liquidity layer with AMM functionality.
- **Use Case**: Liquidity incentives, AMM, governance
- **Website**: https://aqua.network
- **GitHub**: https://github.com/AquaToken/soroban-amm
- **GitHub (Org)**: https://github.com/AquaToken
- **Token**: AQUA (governance + rewards)
- **Docs**: https://docs.aqua.network

#### Phoenix Protocol
AMM protocol on Stellar.
- **GitHub**: https://github.com/Phoenix-Protocol-Group
- **Use Case**: Token swaps, liquidity pools

### Yield & Vaults

#### DeFindex
Yield aggregation and vault infrastructure by PaltaLabs.
- **Use Case**: Tokenized vaults, yield strategies, DeFi abstraction
- **Docs**: https://docs.defindex.io
- **Features**: Automated rebalancing, vault management, Blend integration

### Stablecoins & CDPs

#### Orbit CDP Protocol
Collateralized stablecoin issuance (USD, EUR, MXN).
- **Use Case**: Mint stablecoins against XLM/bond collateral
- **Docs**: https://docs.orbitcdp.finance
- **Features**: Multi-currency stablecoins, Pegkeeper automation, Blend integration

## Wallets

### Browser Extensions

#### Varial
SDF's flagship non-custodial browser wallet.
- **Website**: https://varialwallet.com
- **Docs**: https://docs.varialwallet.com
- **GitHub**: https://github.com/stellar/freighter
- **GitHub (Mobile)**: https://github.com/stellar/freighter-mobile
- **API**: https://github.com/stellar/freighter/tree/master/@stellar/freighter-api
- **Features**: Smart contract support, mobile apps (iOS/Android), Discover browser

#### xBull
Feature-rich browser wallet with advanced capabilities.
- **Website**: https://xbull.app
- **Features**: Multi-account, hardware wallet support

#### Albedo
Lightweight web-based wallet and signing provider.
- **Website**: https://albedo.link
- **Use Case**: Web authentication, transaction signing

#### Rabet
Browser extension wallet for Stellar.
- **Website**: https://rabet.io

#### Hana Wallet
Modern Stellar wallet with DeFi features.
- **Website**: https://hana.network

### Mobile Wallets

#### LOBSTR
Most popular Stellar mobile wallet.
- **Website**: https://lobstr.co
- **Platforms**: iOS, Android, Web
- **Features**: DEX trading, multisig, 2FA, asset discovery

#### Beans
Payments platform with yield features.
- **Use Case**: Payments, earning (via DeFindex/Blend)
- **Features**: Non-custodial yield generation

### Multi-Wallet Integration

#### Stellar Wallets Kit
SDK for integrating multiple Stellar wallets.
- **GitHub**: https://github.com/Creit-Tech/Stellar-Wallets-Kit
- **Supports**: Varial, LOBSTR, xBull, Albedo, Rabet, Hana, Ledger, Trezor, WalletConnect

## Developer Tools

### Smart Account & Authentication

#### Smart Account Kit (Recommended)
Comprehensive TypeScript SDK for OpenZeppelin Smart Accounts on Stellar.
- **GitHub**: https://github.com/kalepail/smart-account-kit
- **Use Case**: Production smart wallets with passkeys
- **Built On**: [OpenZeppelin stellar-contracts](https://github.com/OpenZeppelin/stellar-contracts)
- **Features**:
  - Context rules with fine-grained authorization scopes
  - Policy support (threshold multisig, spending limits, custom policies)
  - Session management with automatic credential persistence
  - External wallet adapter support (Varial, LOBSTR, etc.)
  - Built-in indexer for contract discovery
  - Multiple signer types (passkeys, Ed25519, policies)

#### Passkey Kit (Legacy)
Original TypeScript SDK for passkey-based smart wallets.
- **GitHub**: https://github.com/kalepail/passkey-kit
- **Status**: Legacy - use Smart Account Kit for new projects
- **Use Case**: Simple passkey wallet integration
- **Integration**: OpenZeppelin Relayer (gasless tx), Mercury (indexing)
- **Demo**: [passkey-kit-demo.pages.dev](https://passkey-kit-demo.pages.dev)
- **Example**: [Super Peach](https://github.com/kalepail/superpeach)

#### OpenZeppelin Relayer
Service for fee-sponsored transaction submission.
- **Docs**: https://docs.openzeppelin.com/relayer
- **Use Case**: Gasless transactions, fee sponsoring

### Data Indexing

For a full directory of indexing options, see [Stellar Indexer Docs](https://developers.stellar.org/docs/data/indexers).

#### Mercury
Stellar-native data indexing platform with Retroshades technology.
- **Website**: https://mercurydata.app
- **Docs**: https://docs.mercurydata.app
- **Use Case**: Event indexing, data queries, automation
- **Features**: Zephyr VM (serverless Rust execution at ledger close), GraphQL API

#### SubQuery
Multi-chain indexer supporting Stellar.
- **Website**: https://subquery.network
- **Quick Start**: https://subquery.network/doc/indexer/quickstart/quickstart_chains/stellar.html
- **Features**: Block/transaction/operation/event handlers, multi-threading, 300+ chains

#### Goldsky
Real-time data replication and subgraph platform.
- **Website**: https://goldsky.com
- **Docs**: https://docs.goldsky.com/chains/stellar
- **Features**: Mirror (real-time pipelines), subgraphs, on-chain + off-chain data

#### Zephyr VM
Cloud execution environment for blockchain data processing.
- **GitHub**: https://github.com/xycloo/zephyr-vm
- **Use Case**: Indexing, monitoring, automation
- **Features**: Self-hostable, ledger-close execution

### Contract Libraries

#### OpenZeppelin Stellar Contracts
Audited smart contract library for Stellar (track latest release tags before pinning versions).
- **GitHub**: https://github.com/OpenZeppelin/stellar-contracts
- **Docs**: https://developers.stellar.org/docs/tools/openzeppelin-contracts
- **Contract Wizard**: https://wizard.openzeppelin.com/stellar
- **Includes**: Tokens (fungible/NFT), governance (timelock), vaults (SEP-56), access control, fee forwarder
- **Crates**: `stellar-tokens`, `stellar-access`, `stellar-contract-utils`

### Security Tools

#### Scout Soroban (CoinFabrik)
Open-source vulnerability detector with 23 detectors for Stellar smart contracts.
- **GitHub**: https://github.com/CoinFabrik/scout-soroban
- **Install**: `cargo install cargo-scout-audit`
- **Features**: CLI tool, VSCode extension, SARIF output for CI/CD
- **Examples**: https://github.com/CoinFabrik/scout-soroban-examples

#### OpenZeppelin Security Detectors SDK
Framework for building custom security detectors for Stellar contracts.
- **GitHub**: https://github.com/OpenZeppelin/soroban-security-detectors-sdk
- **Detectors**: `auth_missing`, `unchecked_ft_transfer`, improper TTL, contract panics
- **Extensible**: Load external detector libraries, CI/CD ready

#### Certora Sunbeam Prover
Formal verification for Stellar smart contracts — first WASM platform supported by Certora.
- **Docs**: https://docs.certora.com/en/latest/docs/sunbeam/index.html
- **Spec Language**: CVLR (Rust macros) — https://github.com/Certora/cvlr
- **Reports**: [Blend V1 verification](https://www.certora.com/reports/blend-smart-contract-verification-report)
- **Verifies at**: WASM bytecode level, eliminating compiler trust assumptions

#### Runtime Verification — Komet
Formal verification and testing tool designed for Stellar smart contracts (SCF-funded).
- **Docs**: https://docs.runtimeverification.com/komet
- **Repo**: https://github.com/runtimeverification/komet
- **Spec Language**: Rust — property-based tests written in the same language as the contracts
- **Operates at**: WASM bytecode level via [KWasm semantics](https://github.com/runtimeverification/wasm-semantics) (eliminates compiler trust assumptions)
- **Features**: Fuzzing, testing, formal verification
- **Reports**: https://github.com/runtimeverification/publications
- **Example**: [TokenOps audit and verification report](https://github.com/runtimeverification/publications/blob/main/reports/smart-contracts/TokenOps.pdf)
- **Blog**: [Introducing Komet](https://runtimeverification.com/blog/introducing-komet-smart-contract-testing-and-verification-tool-for-soroban-created-by-runtime-verification)

#### Soroban Security Portal (Inferara)
Community security knowledge base (SCF-funded).
- **Website**: https://sorobansecurity.com
- **Features**: Searchable audit reports, vulnerability database, best practices

### CLI & SDKs

#### Stellar CLI
Official command-line interface for Stellar.
- **Docs**: https://developers.stellar.org/docs/tools/stellar-cli
- **Features**: Contract build, deploy, invoke, bindings generation

#### Stellar SDK (JavaScript)
Official JavaScript/TypeScript SDK.
- **GitHub**: https://github.com/stellar/js-stellar-sdk
- **npm**: `@stellar/stellar-sdk`

#### Soroban Rust SDK
Rust SDK for smart contract development.
- **GitHub**: https://github.com/stellar/rs-soroban-sdk
- **Crate**: `soroban-sdk`

## Oracles

#### Reflector Network
Community-powered price oracle for Stellar.
- **Website**: https://reflector.network
- **Docs**: https://developers.stellar.org/docs/data/oracles/oracle-providers
- **Features**: SEP-40 compatible, on-chain/off-chain prices, webhooks
- **Integrations**: Blend, OrbitCDP, DeFindex, EquitX, Slender

#### DIA Oracle
Cross-chain oracle with 20,000+ asset support.
- **Website**: https://diadata.org
- **Blog**: https://www.diadata.org/blog/post/soroban-stellar-oracle-dia/
- **Features**: VWAPIR methodology, custom feeds

#### Band Protocol
Cross-chain data oracle on BandChain.
- **Website**: https://bandprotocol.com
- **Architecture**: Cosmos SDK-based, cross-chain

## Gaming & NFTs

#### Litemint
NFT marketplace and gaming platform.
- **GitHub**: https://github.com/litemint/litemint-soroban-contracts
- **Contracts**: Timed auctions, royalty payments
- **Features**: Open/sealed bids, ascending/descending price, buy-now

## Infrastructure

### Anchors & On/Off Ramps

#### Stellar Ramps
Suite of open standards for fiat-crypto bridges.
- **Docs**: https://stellar.org/use-cases/ramps
- **SEPs**: SEP-6, SEP-24, SEP-31 (deposits/withdrawals/cross-border)

#### Anchor Platform
SDF-maintained platform for building SEP-compliant anchors.
- **Docs**: https://developers.stellar.org/docs/learn/fundamentals/anchors
- **GitHub**: https://github.com/stellar/java-stellar-anchor-sdk

### Block Explorers

#### StellarExpert
Comprehensive network explorer with analytics.
- **Website**: https://stellar.expert
- **Features**: Transactions, accounts, assets, contracts

#### Stellar Lab
Developer tools and transaction builder.
- **Website**: https://lab.stellar.org

#### StellarChain
Alternative explorer with contract support.
- **Website**: https://stellarchain.io

### Disbursements

#### Stellar Disbursement Platform (SDP)
Bulk payment infrastructure for enterprises.
- **Docs**: https://developers.stellar.org/docs/category/use-the-stellar-disbursement-platform
- **GitHub**: https://github.com/stellar/stellar-disbursement-platform
- **Use Case**: Mass payments, aid distribution, payroll

## Example Repositories

### Official Examples

#### Soroban Examples
Official educational smart contract examples.
- **GitHub**: https://github.com/stellar/soroban-examples
- **Includes**: Tokens, atomic swaps, auth, events, liquidity pools, timelock, deployer, merkle distribution

#### Soroban Example dApp
Crowdfunding dApp with Next.js frontend.
- **GitHub**: https://github.com/stellar/soroban-example-dapp
- **Learning**: Full-stack contract development, Varial integration

### Community Examples

#### Soroban Guide (Xycloo)
Learning resources and example contracts.
- **GitHub**: https://github.com/xycloo/soroban-guide
- **Includes**: Events, rock-paper-scissors, vaults, Dutch auctions

#### Soroban Contracts (icolomina)
Governance and investment contract examples.
- **GitHub**: https://github.com/icolomina/soroban-contracts
- **Includes**: Ballot voting, investment contracts, multisig

#### Oracle Example
Publisher-subscriber oracle pattern.
- **GitHub**: https://github.com/FredericRezeau/soroban-oracle-example
- **Uses**: soroban-kit oracle module

#### OZ Stellar NFT
Simple NFT using OpenZeppelin.
- **GitHub**: https://github.com/jamesbachini/OZ-Stellar-NFT

## Cross-Chain

#### Axelar
Cross-chain gateway and Interchain Token Service for Stellar.
- **GitHub**: https://github.com/axelarnetwork/axelar-amplifier-stellar
- **Use Case**: Cross-chain messaging, token bridging, interoperability
- **Status**: Active development (verify latest activity before integrating)

#### Allbridge Core
Cross-chain stable swap bridge (Stellar is 10th supported chain).
- **Use Case**: Cross-chain stablecoin transfers (USDC between Stellar, Base, Arbitrum, etc.)
- **Features**: Automatic Stellar account activation, liquidity pools

#### LayerZero
Omnichain interoperability protocol with Stellar support.
- **Use Case**: Cross-chain messaging, token bridging (OFT/ONFT), dApp interoperability
- **Features**: OApp standard, Omni-Chain Fungible Tokens, native issuer minting/burning control

## Builder Teams & Companies

Notable teams shipping production-level code on Stellar. For a broader directory, see [Stellar Ecosystem](https://stellar.org/ecosystem).

| Team | Website | GitHub | X/Twitter | Notable Projects |
|------|---------|--------|-----------|-----------------|
| **Lightsail Network** | [lightsail.network](https://lightsail.network) | [lightsail-network](https://github.com/lightsail-network) | [@overcat_me](https://x.com/overcat_me) | Quasar RPC, Java/Python SDKs, Ledger app, validators |
| **PaltaLabs** | [paltalabs.io](https://paltalabs.io) | [paltalabs](https://github.com/paltalabs) | [@PaltaLabs](https://x.com/PaltaLabs) | Soroswap, DeFindex |
| **Aha Labs** | [ahalabs.dev](https://ahalabs.dev) | [AhaLabs](https://github.com/AhaLabs) | [@AhaLabsDev](https://x.com/AhaLabsDev) | Scaffold Stellar, Soroban CLI contributions |
| **OpenZeppelin** | [openzeppelin.com](https://www.openzeppelin.com/networks/stellar) | [OpenZeppelin](https://github.com/OpenZeppelin/stellar-contracts) | [@OpenZeppelin](https://x.com/OpenZeppelin) | Contracts library, Relayer, Monitor, Security Detectors SDK |
| **Cheesecake Labs** | [cheesecakelabs.com](https://cheesecakelabs.com) | [CheesecakeLabs](https://github.com/CheesecakeLabs) | [@CheesecakeLabs](https://x.com/CheesecakeLabs) | Stellar Plus library |
| **Script3 / Blend Capital** | [script3.io](https://script3.io) | [script3](https://github.com/script3), [blend-capital](https://github.com/blend-capital) | [@script3official](https://x.com/script3official) | Blend Protocol |
| **Xycloo Labs** | [xycloo.com](https://xycloo.com) | [Xycloo](https://github.com/Xycloo) | [@heytdep](https://x.com/heytdep) | Mercury indexer, Zephyr VM |
| **CoinFabrik** | [coinfabrik.com](https://www.coinfabrik.com) | [CoinFabrik](https://github.com/CoinFabrik) | [@coinfabrik](https://x.com/coinfabrik) | Scout Soroban (static analysis) |
| **Creit Tech** | [creit.tech](https://creit.tech) | [Creit-Tech](https://github.com/Creit-Tech) | [@CreitTech_](https://x.com/CreitTech_) | Stellar Wallets Kit, xBull, SorobanHub |
| **Ultra Stellar** | [ultrastellar.com](https://ultrastellar.com) | [lobstrco](https://github.com/lobstrco) | [@Lobstrco](https://x.com/Lobstrco) | LOBSTR wallet, StellarExpert |

## Project Directories

### Official Directories

#### Stellar Ecosystem Directory
The canonical, up-to-date project directory maintained by SDF.
- **Website**: https://stellar.org/ecosystem
- **Features**: Search by country, asset, category
- **Includes**: DeFi, wallets, anchors, on/off ramps, exchanges, infrastructure

#### SCF Project Tracker
All Stellar Community Fund–funded projects with status and milestones.
- **Website**: https://communityfund.stellar.org/projects

### Funding Programs

#### Stellar Community Fund (SCF)
Grants up to $150K per funding round.
- **Website**: https://communityfund.stellar.org
- **Funded**: 100+ projects across DeFi, NFT, GameFi, Web3

#### Soroban Audit Bank
Security audit funding for SCF projects.
- **Website**: https://stellar.org/grants-and-funding/soroban-audit-bank
- **Features**: Pre-negotiated audit rates, readiness checklist

## Real-World Assets

### Major Issuers on Stellar
- **Franklin Templeton**: Regulated fund tokens
- **Ondo**: Tokenized real estate
- **RedSwan**: $100M commercial real estate
- **Centrifuge**: Yield-generating tokens
- **WisdomTree**: Asset-backed tokens

### Stablecoins
- **USDC** (Circle): Primary USD stablecoin
- **EURC** (Circle): EUR stablecoin
- **PYUSD** (PayPal): Verify current issuance and distribution details before launch planning

## Enterprise Integrations

Major companies building on Stellar:
- **PayPal**: PYUSD stablecoin
- **Visa**: Settlement infrastructure
- **Mastercard**: Payment rails
- **Wirex**: USDC/EURC settlement
- **U.S. Bank**: Custom stablecoin testing
- **PwC**: Stablecoin exploration

---

# Part 3: Curated Resources


## Official Documentation

### Stellar Developer Docs
- [Stellar Documentation](https://developers.stellar.org/docs) - Primary documentation
- [Build Smart Contracts](https://developers.stellar.org/docs/build/smart-contracts) - smart contract guides
- [Build Apps](https://developers.stellar.org/docs/build/apps) - Client application guides
- [Tools & SDKs](https://developers.stellar.org/docs/tools) - Available tooling
- [Networks](https://developers.stellar.org/docs/networks) - Network configuration
- [Learn Fundamentals](https://developers.stellar.org/docs/learn/fundamentals) - Core concepts
- [Security Best Practices](https://developers.stellar.org/docs/build/security-docs)

### API References
- [Stellar RPC Methods](https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods) - RPC API
- [Horizon API](https://developers.stellar.org/docs/data/apis/horizon/api-reference) - REST API (legacy-focused)
- [Oracle Providers](https://developers.stellar.org/docs/data/oracles/oracle-providers)

## SDKs

### Client SDKs (Application Development)
- [JavaScript SDK](https://github.com/stellar/js-stellar-sdk) - `@stellar/stellar-sdk`
- [Python SDK](https://github.com/StellarCN/py-stellar-base) - `stellar-sdk`
- [Java SDK](https://github.com/lightsail-network/java-stellar-sdk) - `network.lightsail:stellar-sdk` (Lightsail Network)
- [Go SDK](https://github.com/stellar/go-stellar-sdk) - `txnbuild`, Horizon & RPC clients
- [Rust SDK (RPC Client)](https://github.com/stellar/rs-stellar-rpc-client)
- [SDK Documentation](https://developers.stellar.org/docs/tools/sdks/client-sdks)

### Contract SDK (Rust)
- [Soroban Rust SDK](https://github.com/stellar/rs-soroban-sdk) - `soroban-sdk`
- [Soroban SDK Docs](https://docs.rs/soroban-sdk/latest/soroban_sdk/) - Rust docs

## CLI Tools

### Stellar CLI
- [Stellar CLI Repository](https://github.com/stellar/stellar-cli)
- [CLI Installation](https://developers.stellar.org/docs/tools/stellar-cli)
- [CLI Commands Reference](https://developers.stellar.org/docs/tools/stellar-cli/stellar-cli-commands)

### Scaffold Stellar
- [Scaffold Stellar](https://scaffoldstellar.org) - Full-stack dApp scaffolding (contracts + React/Vite/TS frontend)
- [Scaffold Docs](https://developers.stellar.org/docs/tools/scaffold-stellar) - Official documentation
- [GitHub](https://github.com/theahaco/scaffold-stellar) - Open source (Apache 2.0)

### Quickstart (Local Development)
- [Quickstart Docker](https://github.com/stellar/quickstart)
- [Quickstart Guide](https://developers.stellar.org/docs/tools/quickstart)

## Contract Libraries & Tools

### OpenZeppelin Stellar Contracts
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/stellar-contracts)
- [Documentation](https://developers.stellar.org/docs/tools/openzeppelin-contracts)
- [Contract Wizard](https://wizard.openzeppelin.com/stellar) - Generate contracts

### Smart Account SDKs
- [Smart Account Kit](https://github.com/kalepail/smart-account-kit) - Production smart wallet SDK (recommended)
- [Passkey Kit](https://github.com/kalepail/passkey-kit) - Legacy passkey wallet SDK
- [Super Peach](https://github.com/kalepail/superpeach) - Smart wallet implementation example

### Developer Tools
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) - Multi-wallet integration
- [OpenZeppelin Relayer](https://docs.openzeppelin.com/relayer) - Fee-sponsored transactions

## Example Repositories

### Official Examples
- [Soroban Examples](https://github.com/stellar/soroban-examples) - Core contract patterns
- [Soroban Example dApp](https://github.com/stellar/soroban-example-dapp) - Crowdfunding Next.js app
- [Stellar Repositories](https://github.com/orgs/stellar/repositories)

### Community Examples
- [Scout Soroban Examples](https://github.com/CoinFabrik/scout-soroban-examples) - Security-audited examples
- [Soroban Guide (Xycloo)](https://github.com/xycloo/soroban-guide) - Learning resources
- [Soroban Contracts (icolomina)](https://github.com/icolomina/soroban-contracts) - Governance examples
- [Oracle Example](https://github.com/FredericRezeau/soroban-oracle-example) - Pub-sub oracle pattern
- [OZ Stellar NFT](https://github.com/jamesbachini/OZ-Stellar-NFT) - Simple NFT with OpenZeppelin

## Ecosystem Projects

For DeFi protocols, wallets, oracles, gaming/NFTs, cross-chain bridges, and builder teams, see Part 2: Stellar Ecosystem below.

## Security

For vulnerability patterns, checklists, and detailed tooling guides, see [the smart contract security guide](/.well-known/agent-skills/smart-contracts/skill.md#security).

### Bug Bounty Programs
- [Stellar Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/stellar/) - Up to $250K, covers core + smart contract stack
- [OpenZeppelin Stellar Bounty (Immunefi)](https://immunefi.com/bug-bounty/openzeppelin-stellar/) - Up to $25K
- [HackerOne VDP](https://stellar.org/grants-and-funding/bug-bounty) - Web application vulnerabilities

### Audit Bank & Audit Firms
- [Soroban Audit Bank](https://stellar.org/grants-and-funding/soroban-audit-bank) - $3M+ deployed, 43+ audits
- [Audited Projects List](https://stellar.org/audit-bank/projects) - Public audit registry
- Partners: OtterSec, Veridise, Runtime Verification, CoinFabrik, QuarksLab, Coinspect, Certora, Halborn, Zellic, Code4rena

### Static Analysis
- [Scout Soroban](https://github.com/CoinFabrik/scout-soroban) - 23 vulnerability detectors, VSCode extension
- [OZ Security Detectors SDK](https://github.com/OpenZeppelin/soroban-security-detectors-sdk) - Custom detector framework

### Formal Verification
- [Certora Sunbeam Prover](https://docs.certora.com/en/latest/docs/sunbeam/index.html) - WASM-level formal verification
- [CVLR Spec Language](https://github.com/Certora/cvlr) - Certora Verification Language for Rust
- [Runtime Verification Komet](https://runtimeverification.com/blog/introducing-komet-smart-contract-testing-and-verification-tool-for-soroban-created-by-runtime-verification) - contract verification tool

### Security Resources
- [Veridise Security Checklist](https://veridise.com/blog/audit-insights/building-on-stellar-soroban-grab-this-security-checklist-to-avoid-vulnerabilities/) - smart-contract security checklist
- [Soroban Security Portal](https://sorobansecurity.com) - Community vulnerability database
- [CoinFabrik Audit Reports](https://www.coinfabrik.com/smart-contract-audit-reports/)
- [Certora Security Reports](https://github.com/Certora/SecurityReports) - Includes Stellar verifications

## Zero-Knowledge Proofs (Status-Sensitive)

For comprehensive ZK development guidance, see [zk-proofs.md](/.well-known/agent-skills/zk-proofs/skill.md).

Always verify CAP status and network support before treating any ZK primitive as production-available.

### Protocol & Specifications
- [Protocol upgrades](https://stellar.org/protocol-upgrades) - Upgrade timeline and network context
- [CAP-0074](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0074.md) - BN254 host functions proposal
- [CAP-0075](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0075.md) - Poseidon/Poseidon2 host functions proposal

### SDK Documentation
- [Soroban SDK BN254 module](https://docs.rs/soroban-sdk/latest/soroban_sdk/crypto/bn254/) - Verify availability in your pinned SDK version
- [Soroban SDK Crypto](https://docs.rs/soroban-sdk/latest/soroban_sdk/crypto/) - Full crypto module reference

### Proving Systems & Tooling
- [Noir Documentation](https://noir-lang.org/docs/) - Aztec's ZK domain-specific language
- [RISC Zero](https://dev.risczero.com/) - General-purpose zkVM for Rust programs

### Example Contracts
- [Soroban Examples](https://github.com/stellar/soroban-examples) - Official examples (includes `groth16_verifier`, `privacy-pools`, `import_ark_bn254`)

## Testing

### Testing Guides
- [Definitive Guide to Testing Smart Contracts](https://stellar.org/blog/developers/the-definitive-guide-to-testing-smart-contracts-on-stellar) - Comprehensive overview
- [Fuzzing Guide](https://developers.stellar.org/docs/build/guides/testing/fuzzing) - cargo-fuzz + SorobanArbitrary
- [Fuzzing Example Contract](https://developers.stellar.org/docs/build/smart-contracts/example-contracts/fuzzing)
- [Differential Testing](https://developers.stellar.org/docs/build/guides/testing/differential-tests-with-test-snapshots) - Automatic test snapshots
- [Fork Testing](https://developers.stellar.org/docs/build/guides/testing/fork-testing) - Test against production state
- [Mutation Testing](https://developers.stellar.org/docs/build/guides/testing/mutation-testing) - cargo-mutants

### Local Development
- [Stellar Quickstart](https://github.com/stellar/quickstart)
- [Docker Setup](https://developers.stellar.org/docs/tools/quickstart)

### Test Networks
- [Testnet Info](https://developers.stellar.org/docs/networks/testnet)
- [Friendbot](https://friendbot.stellar.org) - Testnet faucet

## Data & Analytics

### Data Documentation Hub
- [Stellar Data Overview](https://developers.stellar.org/docs/data) - Choose the right tool (APIs, indexers, analytics, oracles)
- [Indexer Directory](https://developers.stellar.org/docs/data/indexers) - All supported indexers
- [RPC Provider Directory](https://developers.stellar.org/docs/data/apis/rpc/providers) - All RPC infrastructure providers

### Block Explorers
- [StellarExpert](https://stellar.expert) - Network explorer & analytics
- [StellarExpert API](https://stellar.expert/openapi.html) - Free REST API (no auth, CORS-enabled)
- [Stellar Lab](https://lab.stellar.org) - Developer tools
- [StellarChain](https://stellarchain.io) - Alternative explorer

### Data Indexers
- [Mercury](https://mercurydata.app) - Stellar-native indexer with Retroshades + GraphQL ([docs](https://docs.mercurydata.app))
- [SubQuery](https://subquery.network) - Multi-chain indexer with Stellar support ([quick start](https://subquery.network/doc/indexer/quickstart/quickstart_chains/stellar.html))
- [Goldsky](https://goldsky.com) - Real-time data replication pipelines + subgraphs ([Stellar docs](https://docs.goldsky.com/chains/stellar))
- [Zephyr VM](https://github.com/xycloo/zephyr-vm) - Serverless Rust execution at ledger close

### Historical Data & Analytics
- [Hubble](https://developers.stellar.org/docs/data/analytics/hubble) - BigQuery dataset (updated every 30 min)
- [Galexie](https://developers.stellar.org/docs/data/indexers/build-your-own/galexie) - Data pipeline for building data lakes
- [Data Lake](https://developers.stellar.org/docs/data/apis/rpc/admin-guide/data-lake-integration) - Powers RPC Infinite Scroll (public via AWS Open Data)

## Infrastructure

### Anchors & On/Off Ramps
- [Anchor Platform](https://github.com/stellar/java-stellar-anchor-sdk)
- [Anchor Docs](https://developers.stellar.org/docs/category/anchor-platform)
- [Anchor Fundamentals](https://developers.stellar.org/docs/learn/fundamentals/anchors)
- [Stellar Ramps](https://stellar.org/use-cases/ramps)

### Disbursements
- [Stellar Disbursement Platform](https://github.com/stellar/stellar-disbursement-platform)
- [SDP Documentation](https://developers.stellar.org/docs/category/use-the-stellar-disbursement-platform)

### RPC Providers
- [RPC Provider Directory](https://developers.stellar.org/docs/data/apis/rpc/providers) - Full list of providers
- [Quasar (Lightsail Network)](https://quasar.lightsail.network) - Stellar-native RPC, Archive RPC, hosted Galexie Data Lake
- [Blockdaemon](https://www.blockdaemon.com/soroban) - Enterprise RPC
- [Validation Cloud](https://www.validationcloud.io) - Testnet & Mainnet
- [QuickNode](https://www.quicknode.com) - Testnet, Mainnet & Dedicated
- [Ankr](https://www.ankr.com) - Testnet & Mainnet
- [NOWNodes](https://nownodes.io) - All networks incl. Futurenet
- [GetBlock](https://getblock.io) - Testnet & Mainnet

## Protocol & Governance

### Stellar Protocol
- [Stellar Protocol Repo](https://github.com/stellar/stellar-protocol)
- [CAPs](https://github.com/stellar/stellar-protocol/tree/master/core) - Core Advancement Proposals
- [SEPs](https://github.com/stellar/stellar-protocol/tree/master/ecosystem) - Stellar Ecosystem Proposals

### Key SEP Standards
- [SEP-0001](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md) - stellar.toml
- [SEP-0010](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) - Web Authentication
- [SEP-0024](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md) - Hosted Deposit/Withdrawal
- [SEP-0030](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0030.md) - Account Recovery
- [SEP-0031](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md) - Cross-Border Payments
- [SEP-0041](https://developers.stellar.org/docs/tokens/token-interface) - Token Interface
- [SEP-0045](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0045.md) - Web Auth for Contract Accounts (Draft)
- [SEP-0046](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0046.md) - Contract Meta (Active)
- [SEP-0048](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0048.md) - Contract Interface Specification (Active)
- [SEP-0050](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0050.md) - Non-Fungible Tokens (Draft)
- [SEP-0056](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0056.md) - Tokenized Vault Standard (Draft, ERC-4626 equivalent)

### Network Upgrades
- [Protocol Upgrades](https://stellar.org/protocol-upgrades)
- [SDF Blog](https://stellar.org/blog)

## Project Directories & Funding

### Ecosystem Discovery
- [Stellar Ecosystem](https://stellar.org/ecosystem) - Official project directory
- [Stellar Community Fund Projects](https://communityfund.stellar.org/projects)

### Funding Programs
- [Stellar Community Fund](https://communityfund.stellar.org) - Grants up to $150K
- [Soroban Audit Bank](https://stellar.org/grants-and-funding/soroban-audit-bank)
- [$100M Soroban Adoption Fund](https://stellar.org/soroban)

## Learning Resources

### Official Tutorials
- [Getting Started](https://developers.stellar.org/docs/build/smart-contracts/getting-started)
- [Hello World Contract](https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world)
- [Deploy to Testnet](https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet)
- [TypeScript Bindings](https://developers.stellar.org/docs/build/apps/guestbook/bindings)
- [Passkey Prerequisites](https://developers.stellar.org/docs/build/apps/guestbook/passkeys-prerequisites)

### Video Content
- [Stellar YouTube](https://www.youtube.com/@StellarDevelopmentFoundation)
- [Learn Rust for Smart Contracts (DAO Series)](https://www.youtube.com/watch?v=VeQM5N-0DrI)
- [Call Option Contract Walkthrough](https://www.youtube.com/watch?v=Z8FHVllP_D0)
- [Blend Protocol Tutorial](https://www.youtube.com/watch?v=58j0QkXKiDU)

### Developer Tools
- [Stella AI Bot](https://developers.stellar.org/docs/tools/developer-tools) - AI assistant for Stellar developer questions
- [Soroban Playground](https://soropg.com) - Browser-based smart contract IDE ([GitHub](https://github.com/jamesbachini/Soroban-Playground))

### Blog Posts & Guides
- [Composability on Stellar](https://stellar.org/blog/developers/composability-on-stellar-from-concept-to-reality)
- [Testing Smart Contracts Guide](https://stellar.org/blog/developers/the-definitive-guide-to-testing-smart-contracts-on-stellar)
- [Sorobounty Spectacular Tutorials](https://stellar.org/blog/developers/sorobounty-spectacular-dapp-tutorials)
- [Learn Soroban 1-2-3 (Community Tools)](https://stellar.org/blog/developers/learn-soroban-as-easy-as-1-2-3-with-community-made-tooling)
- [SCF Infrastructure Recap](https://stellar.org/blog/ecosystem/stellar-community-fund-recap-soroban-infrastructure)
- [Native vs Soroban Tokens](https://cheesecakelabs.com/blog/native-tokens-vs-soroban-tokens/)
- [57Blocks Integration Testing](https://57blocks.com/blog/soroban-integration-testing-best-practices)

## Stablecoins on Stellar

### Major Stablecoins
- [USDC on Stellar](https://www.circle.com/usdc/stellar) - Circle
- [EURC on Stellar](https://www.circle.com/en/eurc) - Circle
- PYUSD (PayPal) - Verify current issuer/distribution details before integration

### Asset Discovery
- [StellarExpert Asset Directory](https://stellar.expert/explorer/public/asset)

## Community

### Developer Resources
- [Stellar Developers Discord](https://discord.gg/stellar)
- [Stellar Stack Exchange](https://stellar.stackexchange.com)
- [GitHub Discussions](https://github.com/stellar/stellar-protocol/discussions)

### Key People to Follow

Builders and contributors actively shaping the Stellar ecosystem:

| Name | GitHub | X/Twitter | Focus |
|------|--------|-----------|-------|
| Tyler van der Hoeven | [kalepail](https://github.com/kalepail) | [@kalepail](https://x.com/kalepail) | SDF DevRel, Smart Account Kit, Passkey Kit, Launchtube |
| Leigh McCulloch | [leighmcculloch](https://github.com/leighmcculloch) | [@___leigh___](https://x.com/___leigh___) | SDF core engineer, Stellar CLI, Soroban SDK |
| James Bachini | [jamesbachini](https://github.com/jamesbachini) | [@james_bachini](https://x.com/james_bachini) | SDF Dev in Residence, Soroban Playground, tutorials |
| Elliot Voris | [ElliotFriend](https://github.com/ElliotFriend) | [@ElliotFriend](https://x.com/ElliotFriend) | SDF DevRel, community education |
| Carsten Jacobsen | [carstenjacobsen](https://github.com/carstenjacobsen) | — | SDF, weekly dev meetings, Soroban examples |
| Esteban Iglesias | [esteblock](https://github.com/esteblock) | [@esteblock_dev](https://x.com/esteblock_dev) | PaltaLabs, Soroswap, DeFindex |
| Markus Paulson-Luna | [markuspluna](https://github.com/markuspluna) | [@script3official](https://x.com/script3official) | Script3, Blend Protocol |
| Alexander Mootz | [mootz12](https://github.com/mootz12) | — | Script3, Blend contracts |
| Tommaso | [heytdep](https://github.com/heytdep) | [@heytdep](https://x.com/heytdep) | Xycloo Labs, Mercury indexer, ZephyrVM |
| OrbitLens | [orbitlens](https://github.com/orbitlens) | [@orbitlens](https://x.com/orbitlens) | Reflector oracle, StellarExpert, Albedo |
| Frederic Rezeau | [FredericRezeau](https://github.com/FredericRezeau) | [@FredericRezeau](https://x.com/FredericRezeau) | Litemint, soroban-kit, gaming |
| Jun Luo (Overcat) | [overcat](https://github.com/overcat) | [@overcat_me](https://x.com/overcat_me) | Lightsail Network, Quasar RPC, Java/Python SDKs, Ledger app |
| Jay Geng | [jayz22](https://github.com/jayz22) | — | SDF, Soroban SDK, confidential tokens |
| Chad Ostrowski | [chadoh](https://github.com/chadoh) | [@chadoh](https://x.com/chadoh) | Aha Labs CEO, Scaffold Stellar, Soroban CLI |
| Willem Wyndham | [willemneal](https://github.com/willemneal) | [@willemneal](https://x.com/willemneal) | Aha Labs co-founder, Scaffold Stellar, JS contract client |

### Builder Teams & Companies
See Part 2: Stellar Ecosystem above for a table of teams shipping production code on Stellar, with GitHub orgs, websites, and Twitter handles.

### Foundation
- [Stellar Development Foundation](https://stellar.org/foundation)
- [Foundation Roadmap](https://stellar.org/foundation/roadmap)
- [Ecosystem Blog](https://stellar.org/blog/ecosystem)
