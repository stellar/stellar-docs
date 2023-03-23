// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Stellar Documentation",
  tagline:
    "Stellar is a self-serve distributed ledger that you can use as a backend to power all kinds of apps and services",
  url: "https://developers.stellar.org",
  baseUrl: "/",
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
      "@docusaurus/plugin-google-analytics",
      {
        trackingID: "UA-53373928-1",
        anonymizeIP: true,
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "api",
        config: {
          api: {
            specPath: "openapi/bundled.yml", // Path to designated spec file
            outputDir: "api/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          ap_api: {
            specPath: "openapi/ap/bundled.yml", // Path to designated spec file
            outputDir: "ap_api/resources", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "api",
        routeBasePath: "api",
        docLayoutComponent: "@theme/DocPage",
        docItemComponent: "@theme/ApiItem",
        sidebarPath: require.resolve("./sidebarsApi.js"),
        sidebarItemsGenerator: require("./src/sidebar-api-generator"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "ap_api",
        path: "ap_api",
        routeBasePath: "ap_api",
        docLayoutComponent: "@theme/DocPage",
        docItemComponent: "@theme/ApiItem",
        sidebarPath: require.resolve("./sidebarsApi.js"),
        sidebarItemsGenerator: require("./src/sidebar-api-generator"),
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
        blog: false,
        docs: {
          showLastUpdateTime: true,
          breadcrumbs: true,
          routeBasePath: "/docs",
          remarkPlugins: [require("mdx-mermaid"), require('remark-math')],
          rehypePlugins: [require('rehype-katex')],
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/stellar/stellar-docs/tree/main",
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
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
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      navbar: {
        logo: {
          width: 100,
          src: "img/stellar-logo.svg",
          srcDark: "img/stellar-logo-dark.svg",
          href: "/docs",
        },
        items: [
          {
            to: "/docs",
            label: "Docs",
            position: "left",
          },
          {
            to: "/api",
            label: "Horizon API",
            position: "left",
          },
          {
            to: "/ap_api",
            label: "Anchor Platform API",
            position: "left",
          },
          {
            href: "https://github.com/stellar/stellar-docs",
            label: "GitHub",
            position: "right",
          },
          {
            type: "search",
            position: "right",
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
                label: "Developers Blog",
                href: "https://www.stellar.org/developers-blog",
              },
              {
                label: "Stellar Quest",
                href: "https://quest.stellar.org/",
              },
              {
                label: "Stellar Community Fund",
                href: "https://communityfund.stellar.org/",
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
                href: "https://developers.stellar.org/docs/tools-and-sdks/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Developers Discord",
                href: "https://discord.gg/st7Mxd58BV",
              },
              {
                label: "Developers Google Group",
                href: "https://groups.google.com/g/stellar-dev",
              },
              {
                label: "Stack Exchange",
                href: "https://stellar.stackexchange.com/",
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
          "docker"
        ],
      },
    }),
};

module.exports = config;
