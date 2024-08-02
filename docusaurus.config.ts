import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Plugin from '@docusaurus/types/src/plugin';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: "Stellar Docs",
  tagline:
    "Stellar is a self-serve distributed ledger that you can use as a backend to power all kinds of apps and services",
  url: "https://developers.stellar.org",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon-96x96.png",
  organizationName: "stellar",
  projectName: "stellar-docs",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
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
            specPath: "openapi/horizon/bundled.yml", // Path to designated spec file
            outputDir: "docs/data/horizon/api-reference", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tagGroup",
            },
          },
        },
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "platformapis",
        docsPluginId: "platforms",
        config: {
          anchor_platform_api: {
            specPath: "openapi/anchor-platform/bundled.yml", // Path to designated spec file
            outputDir: "platforms/anchor-platform/api-reference/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          } satisfies OpenApiPlugin.Options,
          anchor_platform_callbacks: {
            specPath: "openapi/anchor-platform/bundled_callback.yml", // Path to designated spec file
            outputDir: "platforms/anchor-platform/api-reference/callbacks", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          } satisfies OpenApiPlugin.Options,
          anchor_custody_api: {
            specPath: "openapi/anchor-platform/bundled_custody.yml", // Path to designated spec file
            outputDir: "platforms/anchor-platform/api-reference/custody-server", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          } satisfies OpenApiPlugin.Options,
          stellar_disbursement_platform: {
            specPath: "openapi/stellar-disbursement-platform/bundled.yml", // Path to designated spec file
            outputDir: "platforms/stellar-disbursement-platform/api-reference/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          } satisfies OpenApiPlugin.Options,
        } satisfies Plugin.PluginOptions,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "platforms",
        path: "platforms",
        routeBasePath: "/platforms",
        docItemComponent: "@theme/ApiItem",
        sidebarPath: require.resolve("./sidebarsPlatforms.js"),
        sidebarItemsGenerator: require("./src/sidebar-platforms-generator"),
        editUrl: "https://github.com/stellar/stellar-docs/tree/main",
        exclude: ['**/component/**', '**/README.md'],
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
    require("./src/analytics-module"),
    require("./src/dev-server-plugin"),
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
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarItemsGenerator: require("./src/sidebar-generator"),
          editUrl: "https://github.com/stellar/stellar-docs/tree/main",
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
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    image: 'img/dev-docs-preview.png',
    navbar: {
      logo: {
        width: 100,
        src: "img/stellar-logo.svg",
        srcDark: "img/stellar-logo-dark.svg",
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
              docId: "data/rpc/README",
              label: "RPC",
            },
            {
              type: 'doc',
              docId: "data/hubble/README",
              label: "Hubble",
            },
            {
              type: 'doc',
              docId: "data/horizon/README",
              label: "Horizon",
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
              to: '/docs/tools/sdks/library',
              label: 'SDKs',
              activeBasePath: 'docs/tools/sdks'
            },
            {
              to: '/docs/tools/developer-tools',
              label: 'Developer Tools'
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
          to: '/meetings',
          label: 'Meetings',
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
              label: "Dapps Challenge",
              href: "/docs/learn/interactive/dapps/introduction"
            }
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
              label: "Laboratory",
              href: "https://laboratory.stellar.org",
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
              label: "Developer Discord",
              href: "https://discord.gg/st7Mxd58BV",
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
