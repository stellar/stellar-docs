// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
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
  customFields: {
    themeConfig: {
      image: 'img/stellar_stacked.jpg',
    },
  },
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
        docsPluginId: "network",
        config: {
          horizon: {
            specPath: "openapi/horizon/bundled.yml", // Path to designated spec file
            outputDir: "network/horizon/api-reference/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          anchor_platform_api: {
            specPath: "openapi/anchor-platform/bundled.yml", // Path to designated spec file
            outputDir: "network/anchor-platform/api-reference/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          },
          anchor_platform_callbacks: {
            specPath: "openapi/anchor-platform/bundled_callback.yml", // Path to designated spec file
            outputDir: "network/anchor-platform/api-reference/callbacks", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          },
          anchor_custody_api: {
            specPath: "openapi/anchor-platform/bundled_custody.yml", // Path to designated spec file
            outputDir: "network/anchor-platform/api-reference/custody-server", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          },
          stellar_disbursement_platform: {
            specPath: "openapi/stellar-disbursement-platform/bundled.yml", // Path to designated spec file
            outputDir: "network/stellar-disbursement-platform/api-reference/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            template: "src/template.mustache", // Customize API MDX with mustache template
          }
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "network",
        path: "network",
        routeBasePath: "/network",
        docLayoutComponent: "@theme/DocPage",
        docItemComponent: "@theme/ApiItem",
        sidebarPath: require.resolve("./sidebarsNetwork.js"),
        sidebarItemsGenerator: require("./src/sidebar-network-generator"),
        editUrl: "https://github.com/stellar/stellar-docs/tree/main",
        exclude: ['**/component/**', '**/README.md'],
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
    require("./src/analytics-module"),
    require("./src/dev-server-plugin"),
  ],
  themes: ["docusaurus-theme-openapi-docs"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
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
          remarkPlugins: [require("mdx-mermaid"), require('remark-math'), [
            require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }
          ]],
          rehypePlugins: [require('rehype-katex')],
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
      }),
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
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      image: 'img/favicon-96x96.png',
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
            sidebarId: 'docs',
            label: 'Docs',
            position: 'left',
          },
          {
            type: 'docSidebar',
            sidebarId: 'smartContracts',
            label: 'Smart Contracts',
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
            sidebarId: 'tools',
            label: 'Tools',
            position: 'left',
          },
          {
            type: 'docSidebar',
            sidebarId: 'reference',
            label: 'Reference',
            position: 'left',
          },
          {
            type: "dropdown",
            label: "Network",
            position: "left",
            to: '/network',
            items: [
              {
                type: 'html',
                value: '<small>Data Availability</small>',
                className: 'subtitle',
              },
              {
                to: "/network/soroban-rpc",
                label: "Soroban RPC",
              },
              {
                to: "/network/hubble",
                label: "Hubble",
              },
              {
                to: "/network/horizon",
                label: "Horizon",
              },
              {
                type: 'html',
                value: '<hr><small>Platforms</small>',
                className: 'subtitle',
              },
              {
                to: "/network/anchor-platform",
                label: "Anchor Platform",
              },
              {
                to: "/network/stellar-disbursement-platform",
                label: "Stellar Disbursement Platform",
              },
              {
                type: 'html',
                value: '<hr><small>Network Infrastructure</small>',
                className: 'subtitle',
              },
              {
                to: "/network/core-node",
                label: "Core Validator Node",
              },
            ]
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
        theme: require("prism-react-renderer/themes/github"),
        darkTheme: require("prism-react-renderer/themes/vsDark"),
        additionalLanguages: [
          "java",
          "scala",
          "rust",
          "toml",
          "json5",
          "python",
          "docker",
          "kotlin",
          "dart",
          "nginx",
          "log",
          "powershell"
        ],
      },
    }),
};

module.exports = config;
