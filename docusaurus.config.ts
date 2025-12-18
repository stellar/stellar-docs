import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { themes as prismThemes } from 'prism-react-renderer';

import { makeEditUrl, DEFAULT_LOCALE } from './config/constants';
import { anchorPlatformPluginInstances } from './config/anchorPlatform.config';
import { disbursementPlatformPluginInstances } from './config/disbursementPlatform.config';

import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // future: {
  //   experimental_faster: true,
  // },
  title: "Stellar Docs",
  tagline:
    "Stellar is a self-serve distributed ledger that you can use as a backend to power all kinds of apps and services",
  url: "https://developers.stellar.org",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenAnchors: "ignore",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/docusaurus/favicon-96x96.png",
  organizationName: "stellar",
  projectName: "stellar-docs",
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: ["en", "es"],
  },
  plugins: [
    "docusaurus-plugin-sass",
    [
      "docusaurus-plugin-sentry",
      {
        DSN: "efc31f19f9c54082b8d993bfb62eee57",
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          horizon: {
            specPath: "openapi/horizon/bundled.yml",
            outputDir: "docs/data/apis/horizon/api-reference",
            sidebarOptions: {
              groupPathsBy: "tagGroup",
            },
          },
        },
      },
    ],
    ...anchorPlatformPluginInstances,
    ...disbursementPlatformPluginInstances,
    require("./src/analytics-module"),
    require("./src/dev-server-plugin"),
    require("./src/route-export-plugin"),
  ],
  markdown: {
    mermaid: true,
    mdx1Compat: {
      headingIds: true,
    },
  },
  themes: ["docusaurus-theme-openapi-docs", "@docusaurus/theme-mermaid"],
  presets: [
    [
      "classic",
      {
        blog: {
          path: 'meeting-notes',
          blogTitle: 'Meeting Notes',
          blogDescription: 'Notes and recordings from the Soroban protocol & developers meetings',
          blogSidebarTitle: 'All meetings',
          blogSidebarCount: 'ALL',
          postsPerPage: 'ALL',
          routeBasePath: 'meetings',
          onUntruncatedBlogPosts: 'ignore',
        },
        docs: {
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          breadcrumbs: true,
          routeBasePath: "/docs",
          docItemComponent: "@theme/ApiItem",
          remarkPlugins: [remarkMath, [
            require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }
          ]],
          rehypePlugins: [rehypeKatex],
          sidebarPath: "config/sidebars.ts",
          sidebarItemsGenerator: require("./src/sidebar-generator"),
          editUrl: makeEditUrl,
          exclude: ['**/component/**', '**/README.md'],
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
        gtag: {
          trackingID: "G-ZCT4GYX8KN",
          anonymizeIP: true,
        }
      } satisfies Preset.Options,
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
    {
      href: "https://use.fontawesome.com/releases/v6.5.2/css/all.css",
      type: 'text/css',
    },
  ],
  themeConfig: {
    announcementBar: {
      id: 'announcementBar-translation',
      content: '<strong>Disclaimer:</strong> This documentation has been automatically translated and may contain inaccuracies. For the most accurate information, please refer to the original English version. We are not responsible for translation errors.',
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    image: 'img/docusaurus/dev-docs-preview.png',
    navbar: {
      logo: {
        width: 100,
        src: "img/docusaurus/stellar-logo.svg",
        srcDark: "img/docusaurus/stellar-logo-dark.svg",
        href: "/",
      },
      items: [
        {
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
              to: '/docs/build/apps/smart-wallets',
              label: 'Smart Wallets',
              activeBasePath: 'docs/build/apps/smart-wallets',
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
              to: '/docs/build/guides/cli',
              label: 'CLI',
              activeBasePath: 'docs/build/guides/cli',
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
        },
        {
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
              to: '/docs/learn/fundamentals/networks',
              label: 'Networks',
              activeBasePath: 'docs/learn/fundamentals/networks',
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
        },
        {
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
        },
        {
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
              to: '/docs/data/apis/horizon',
              label: 'Horizon',
              activeBasePath: 'docs/data/apis/horizon'
            },
            {
              to: '/docs/data/apis/migrate-from-horizon-to-rpc',
              label: 'Migrate Horizon to RPC',
              activeBasePath: 'docs/data/apis/migrate-from-horizon-to-rpc'
            },
            {
              to: '/docs/data/apis/api-providers',
              label: 'Providers',
              activeBasePath: 'docs/data/apis/api-providers'
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
              to: '/docs/data/indexers/indexer-providers',
              label: 'Providers',
              activeBasePath: 'docs/data/indexers/indexer-providers'
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
        },
        {
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
              to: '/docs/tools/developer-tools/openzeppelin-contracts',
              label: 'OpenZeppelin Contracts',
              activeBasePath: 'docs/tools/developer-tools/openzeppelin-contracts'
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
              to: "/platforms/anchor-platform",
              label: "Anchor Platform",
            },
            {
              to: "/platforms/stellar-disbursement-platform",
              label: "Stellar Disbursement Platform",
            },
          ]
        },
        {
          type: 'dropdown',
          label: 'Networks',
          position: 'left',
          to: '/docs/networks',
          exact: true,
          items: [
            {
              to: '/docs/networks',
              label: 'Network Configuration',
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
        },
        {
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
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'ap',
          dropdownActiveClassDisabled: true,
          position: 'right',
        },
        {
          to: '/meetings',
          label: 'Meetings',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: "https://github.com/stellar/stellar-docs",
          position: "right",
          className: "header-github-link",
          'aria-label': "GitHub",
        },
        {
          href: "https://discord.gg/stellardev",
          position: "right",
          className: "header-discord-link",
          'aria-label': "Discord",
        },
      ],
    },
    algolia: {
      appId: "VNSJF5AWIZ",
      apiKey: "c932e7670879e29070e269d202fb6740",
      indexName: "crawler_Stellar Docs - Docusaurus",
    },
    footer: {
      links: [
        {
          title: "Resources",
          items: [
            {
              label: "Developer Blog",
              href: "https://www.stellar.org/developers-blog",
            },
            {
              label: "Stellar Quest",
              href: "https://quest.stellar.org/",
            },
            {
              label: "Soroban Quest",
              href: "https://fastcheapandoutofcontrol.com/tutorial",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/@StellarDevelopmentFoundation",
            },
            {
              label: "Twitch",
              href: "https://m.twitch.tv/stellarorg/home",
            },
          ],
        },
        {
          title: "Tools",
          items: [
            {
              label: "Explorer",
              href: "https://stellar.expert",
            },
            {
              label: "Lab",
              href: "https://lab.stellar.org",
            },
            {
              label: "Status",
              href: "https://status.stellar.org/",
            },
            {
              label: "Dashboard",
              href: "https://dashboard.stellar.org/",
            },
            {
              label: "All Tools",
              href: "https://developers.stellar.org/docs/tools/developer-tools",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Contribute to Docs",
              href: "https://github.com/stellar/stellar-docs?tab=readme-ov-file#contributing",
            },
            {
              label: "Developer Discord",
              href: "https://discord.gg/stellardev",
            },
            {
              label: "Developer Google Group",
              href: "https://groups.google.com/g/stellar-dev",
            },
            {
              label: "Stack Exchange",
              href: "https://stellar.stackexchange.com/",
            },
            {
              label: "Stellar Community Fund",
              href: "https://communityfund.stellar.org/",
            },
         ],
        },
        {
          title: "About",
          items: [
            {
              label: "About SDF",
              href: "https://stellar.org/foundation",
            },
            {
              label: "Careers",
              href: "https://stellar.org/foundation/careers",
            },
            {
              label: "Events",
              href: "https://stellar.org/events",
            },
            {
              label: "Grants & Funding",
              href: "https://stellar.org/foundation/grants-and-funding",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: [
        "bash",
        "dart",
        "diff",
        "docker",
        "java",
        "json",
        "json5",
        "kotlin",
        "log",
        "nginx",
        "powershell",
        "php",
        "python",
        "rust",
        "scala",
        "toml",
        "yaml",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
