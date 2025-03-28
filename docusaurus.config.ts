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
          type: 'docSidebar',
          sidebarId: 'build',
          label: 'Build',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'learn',
          label: 'Learn',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tokens',
          label: 'Tokens',
          position: 'left',
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
              to: '/docs/tools/developer-tools',
              label: 'More Developer Tools'
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
          type: 'docSidebar',
          sidebarId: 'networks',
          label: 'Networks',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'validators',
          label: 'Validators',
          position: 'left',
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
