import type { NavbarItem } from '@docusaurus/theme-common';
import { GOOGLE_TRANSLATE_ELEMENT } from '../constants';

const build: NavbarItem = {
  type: 'dropdown',
  label: 'Build',
  position: 'left',
  to: '/docs/build',
  items: [
    {
      to: '/docs/build',
      label: 'Overview',
      activeBasePath: 'docs/build',
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/build/smart-contracts" class="subtitle"><small>Build Smart Contracts</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/build/smart-contracts/overview',
      label: 'Introduction',
      activeBasePath: 'docs/build/smart-contracts/overview',
    },
    {
      to: '/docs/build/smart-contracts/getting-started',
      label: 'Getting Started',
      activeBasePath: 'docs/build/smart-contracts/getting-started',
      className: 'has-nested-items',
    },
    {
      to: '/docs/build/smart-contracts/example-contracts',
      label: 'Example Contracts',
      activeBasePath: 'docs/build/smart-contracts/example-contracts',
      className: 'has-nested-items',
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/build/apps" class="subtitle"><small>Build Applications</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/build/apps/overview',
      label: 'Introduction',
      activeBasePath: 'docs/build/apps/overview',
    },
    {
      to: '/docs/build/apps/application-design-considerations',
      label: 'Application Design Considerations',
      activeBasePath: 'docs/build/apps/application-design-considerations',
    },
    {
      to: '/docs/build/apps/wallet/overview',
      label: 'Tutorial: Wallet SDK',
      activeBasePath: 'docs/build/apps/wallet/overview',
    },
    {
      to: '/docs/build/apps/example-application-tutorial/overview',
      label: 'Tutorial: Payment Application, JavaScript',
      activeBasePath: 'docs/build/apps/example-application-tutorial/overview',
    },
    {
      to: '/docs/build/apps/swift-payment-app',
      label: 'Tutorial: Payment Application, Swift',
      activeBasePath: 'docs/build/apps/swift-payment-app',
    },
    {
      to: '/docs/build/apps/ingest-sdk/overview',
      label: 'Tutorial: Network Ingestion Pipeline',
      activeBasePath: 'docs/build/apps/ingest-sdk/overview',
    },
    {
      to: '/docs/build/apps/guestbook/overview',
      label: 'Tutorial: Passkey Dapp',
      activeBasePath: 'docs/build/apps/guestbook/overview',
    },
    {
      to: '/docs/build/apps/dapp-frontend',
      label: 'Tutorial: Dapp Frontend',
      activeBasePath: 'docs/build/apps/dapp-frontend',
    },
    {
      to: '/docs/build/apps/zk',
      label: 'ZK Proofs on Stellar',
      activeBasePath: 'docs/build/apps/zk',
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/build/guides" class="subtitle"><small>How-To Guides</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/build/guides/auth',
      label: 'Contract Authorization',
      activeBasePath: 'docs/build/guides/auth',
    },
    {
      to: '/docs/build/guides/contract-accounts',
      label: 'Contract Accounts',
      activeBasePath: 'docs/build/guides/contract-accounts',
    },
    {
      to: '/docs/build/guides/conventions',
      label: 'Contract Conventions',
      activeBasePath: 'docs/build/guides/conventions',
    },
    {
      to: '/docs/build/guides/events',
      label: 'Contract Events',
      activeBasePath: 'docs/build/guides/events',
    },
    {
      to: '/docs/build/guides/storage',
      label: 'Contract Storage',
      activeBasePath: 'docs/build/guides/storage',
    },
    {
      to: '/docs/build/guides/testing',
      label: 'Contract Testing',
      activeBasePath: 'docs/build/guides/testing',
    },
    {
      to: '/docs/build/guides/dapps',
      label: 'Dapp Development',
      activeBasePath: 'docs/build/guides/dapps',
    },
    {
      to: '/docs/build/guides/fees',
      label: 'Fees & Metering',
      activeBasePath: 'docs/build/guides/fees',
    },
    {
      to: '/docs/build/guides/freighter',
      label: 'Freighter Wallet',
      activeBasePath: 'docs/build/guides/freighter',
    },
    {
      to: '/docs/build/guides/basics',
      label: 'Stellar Basics',
      activeBasePath: 'docs/build/guides/basics',
    },
    {
      to: '/docs/build/guides/rpc',
      label: 'RPC',
      activeBasePath: 'docs/build/guides/rpc',
    },
    {
      to: '/docs/build/guides/archival',
      label: 'State Archival',
      activeBasePath: 'docs/build/guides/archival',
    },
    {
      to: '/docs/build/guides/tokens',
      label: 'Stellar Asset Contract Tokens',
      activeBasePath: 'docs/build/guides/tokens',
    },
    {
      to: '/docs/build/guides/transactions',
      label: 'Transactions',
      activeBasePath: 'docs/build/guides/transactions',
    },
    {
      to: '/docs/build/guides/conversions',
      label: 'Type Conversions',
      activeBasePath: 'docs/build/guides/conversions',
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/build/security-docs" class="dropdown__link has-nested-items">Security Best Practices</a>',
    },
  ],
}

const learn: NavbarItem = {
  type: 'dropdown',
  label: 'Learn',
  position: 'left',
  to: '/docs/learn/fundamentals',
  items: [
    {
      type: 'html',
      value: '<hr><a href="/docs/learn/fundamentals" class="subtitle"><small>Core Concepts</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/learn/fundamentals/stellar-stack',
      label: 'Stellar Stack',
      activeBasePath: 'docs/learn/fundamentals/stellar-stack',
    },
    {
      to: '/docs/learn/fundamentals/lumens',
      label: 'Lumens (XLM)',
      activeBasePath: 'docs/learn/fundamentals/lumens',
    },
    {
      to: '/docs/learn/fundamentals/stellar-consensus-protocol',
      label: 'Stellar Consensus Protocol (SCP)',
      activeBasePath: 'docs/learn/fundamentals/stellar-consensus-protocol',
    },
    {
      to: '/docs/learn/fundamentals/stellar-data-structures',
      label: 'Data Structures',
      activeBasePath: 'docs/learn/fundamentals/stellar-data-structures',
      className: 'has-nested-items',
    },
    {
      to: '/docs/learn/fundamentals/transactions',
      label: 'Operations & Transactions',
      activeBasePath: 'docs/learn/fundamentals/transactions',
      className: 'has-nested-items',
    },
    {
      to: '/docs/learn/fundamentals/fees-resource-limits-metering',
      label: 'Fees & Metering',
      activeBasePath: 'docs/learn/fundamentals/fees-resource-limits-metering',
    },
    {
      to: '/docs/learn/fundamentals/stellar-ecosystem-proposals',
      label: 'Stellar Ecosystem Proposals (SEPs)',
      activeBasePath: 'docs/learn/fundamentals/stellar-ecosystem-proposals',
    },
    {
      to: '/docs/learn/fundamentals/contract-development',
      label: 'Smart Contracts',
      activeBasePath: 'docs/learn/fundamentals/contract-development',
      className: 'has-nested-items',
    },
    {
      to: '/docs/learn/fundamentals/data-format',
      label: 'Data Format',
      activeBasePath: 'docs/learn/fundamentals/data-format',
      className: 'has-nested-items',
    },
    {
      to: '/docs/learn/fundamentals/anchors',
      label: 'Ramps (anchors)',
      activeBasePath: 'docs/learn/fundamentals/anchors',
    },
    {
      to: '/docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools',
      label: 'SDEX',
      activeBasePath: 'docs/learn/fundamentals/liquidity-on-stellar-sdex-liquidity-pools',
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/learn/glossary" class="dropdown__link">Glossary</a>',
    },
    {
      to: 'docs/learn/migrate',
      label: 'Migrate from Another Chain',
    },
    {
      to: 'docs/learn/interactive',
      label: 'Interactive Learning',
    },
  ],
}

const tokens: NavbarItem = {
  type: 'dropdown',
  label: 'Tokens',
  position: 'left',
  to: '/docs/tokens',
  exact: true,
  items: [
    {
      to: '/docs/tokens',
      label: 'Stellar Assets & Contract Tokens',
      exact: true,
    },
    {
      to: 'docs/tokens/anatomy-of-an-asset',
      label: 'Assets Overview',
    },
    {
      to: '/docs/tokens/quickstart',
      label: 'Quickstart Guide',
    },
    {
      to: '/docs/tokens/control-asset-access',
      label: 'Asset Design Considerations',
    },
    {
      to: '/docs/tokens/stellar-asset-contract',
      label: 'Stellar Asset Contract',
    },
    {
      to: '/docs/tokens/token-interface',
      label: 'Token Interface',
    },
    {
      to: '/docs/tokens/how-to-issue-an-asset',
      label: 'Tutorial: Issue an Asset',
    },
    {
      to: '/docs/tokens/publishing-asset-info',
      label: 'Publish Asset Information',
    },
  ],
}

const data: NavbarItem = {
  type: "dropdown",
  label: "Data",
  position: "left",
  to: '/docs/data',
  items: [
    {
      type: 'doc',
      docId: "data/README",
      label: "Overview",
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/data/analytics" class="subtitle"><small>Analytics</small>',
      className:'subtitle'
    },
    {
      to: '/docs/data/analytics/hubble',
      label: 'Hubble',
      activeBasePath: 'docs/data/analytics/hubble'
    },
    {
      to: '/docs/data/analytics/analytics-providers',
      label: 'Providers',
      activeBasePath: 'docs/data/analytics/analytics-providers'
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/data/apis" class="subtitle"><small>API</small>',
      className:'subtitle'
    },
    {
      to: '/docs/data/apis/rpc',
      label: 'RPC',
      activeBasePath: 'docs/data/apis/rpc'
    },
    {
      to: '/docs/data/apis/rpc/providers',
      label: 'RPC Providers',
      activeBasePath: 'docs/data/apis/rpc/providers'
    },
    {
      to: '/docs/data/apis/horizon',
      label: 'Horizon',
      activeBasePath: 'docs/data/apis/horizon'
    },
    {
      to: '/docs/data/apis/horizon/providers',
      label: 'Horizon Providers',
      activeBasePath: 'docs/data/apis/horizon/providers'
    },
    {
      to: '/docs/data/apis/migrate-from-horizon-to-rpc',
      label: 'Migrate Horizon to RPC',
      activeBasePath: 'docs/data/apis/migrate-from-horizon-to-rpc'
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/data/indexers" class="subtitle"><small>Indexers</small>',
      className:'subtitle'
    },
    {
      to: '/docs/data/indexers/build-your-own',
      label: 'Build Your Own',
      activeBasePath: 'docs/data/indexers/build-your-own'
    },
    {
      type: 'html',
      value: '<hr><a href="/docs/data/oracles" class="subtitle"><small>Oracles</small>',
      className:'subtitle'
    },
    {
      to: '/docs/data/oracles',
      label: 'Providers',
      activeBasePath: 'docs/data/oracles'
    },
  ]
}

const tools: NavbarItem = {
  type: 'dropdown',
  label: 'Tools',
  position: 'left',
  to: '/docs/tools',
  activeBaseRegex: `(docs/tools|platforms)`,
  items: [
    {
      type: 'html',
      value: '<hr><small>Developer Tools</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/tools/sdks',
      label: 'SDKs',
      activeBasePath: 'docs/tools/sdks'
    },
    {
      to: '/docs/tools/cli',
      label: 'Stellar CLI',
      activeBasePath: 'docs/tools/cli'
    },
    {
      to: '/docs/tools/lab',
      label: 'Lab',
      activeBasePath: 'docs/tools/lab'
    },
    {
      to: '/docs/tools/quickstart',
      label: 'Quickstart',
      activeBasePath: 'docs/tools/quickstart'
    },
    {
      to: '/docs/tools/openzeppelin-relayer',
      label: 'OpenZeppelin Relayer',
      activeBasePath: 'docs/tools/openzeppelin-relayer'
    },
    {
      to: '/docs/tools/openzeppelin-contracts',
      label: 'OpenZeppelin Contracts',
      activeBasePath: 'docs/tools/openzeppelin-contracts'
    },
    {
      to: '/docs/tools/scaffold-stellar',
      label: 'Scaffold Stellar',
      activeBasePath: 'docs/tools/scaffold-stellar'
    },
    {
      to: '/docs/tools/developer-tools',
      label: 'More Developer Tools',
      className: 'has-nested-items',
    },
    {
      type: 'html',
      value: '<hr><small>Ramps</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/tools/ramps/moneygram',
      label: 'MoneyGram Ramps',
      activeBasePath: '/docs/tools/ramps/moneygram'
    },
    {
      type: 'html',
      value: '<hr><small>Infra Tools</small>',
      className: 'subtitle',
    },
    {
      to: '/docs/tools/infra-tools/cross-chain',
      label: 'Cross-Chain',
      activeBasePath: 'docs/tools/infra-tools/cross-chain'
    },
    {
      type: 'html',
      value: '<hr><small>SDF Platforms</small>',
      className: 'subtitle',
    },
    {
      type: 'docSidebar',
      // docId: "docs/platforms/anchor-platform/README",
      sidebarId: 'anchor_platform',
      label: "Anchor Platform",
    },
    {
      type: 'docSidebar',
      // docId: "docs/platforms/stellar-disbursement-platform/README",
      sidebarId: 'stellar_disbursement_platform',
      label: "Stellar Disbursement Platform",
    },
  ]
}

const networks: NavbarItem = {
  type: 'dropdown',
  label: 'Networks',
  position: 'left',
  to: '/docs/networks',
  exact: true,
  items: [
    {
      to: '/docs/networks',
      label: 'Networks Overview',
      exact: true,
    },
    {
      to: '/docs/networks/software-versions',
      label: 'Software Versions',
    },
    {
      to: '/docs/networks/resource-limits-fees',
      label: 'Resource Limits & Fees',
    }
  ]
}

const validators: NavbarItem = {
  type: 'dropdown',
  label: 'Validators',
  position: 'left',
  to: '/docs/validators',
  exact: true,
  items: [
    {
      to: 'docs/validators',
      label: 'Validators Introduction',
      exact: true,
    },
    {
      to: 'docs/validators/admin-guide',
      label: 'Admin Guide',
    },
    {
      to: 'docs/validators/tier-1-orgs',
      label: 'Tier 1 Organizations',
    }
  ]
}

const translation: NavbarItem[] = [
  {
    type: 'html',
    position: 'right',
    value: '<div id="google_translate_element"></div>',
  },
  {
    type: 'html',
    position: 'right',
    value: GOOGLE_TRANSLATE_ELEMENT,
  },
  // {
  //   type: 'localeDropdown',
  //   position: 'right',
  // },
]

export default {
  build,
  learn,
  tokens,
  data,
  tools,
  networks,
  validators,
  translation,
}
