// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Stellar Documentation",
  tagline: "Stellar is a self-serve distributed ledger that you can use as a backend to power all kinds of apps and services",
  url: "https://developers.stellar.org",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon-96x96.png",
  organizationName: "stellar",
  projectName: "stellar-docs",
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    "docusaurus-plugin-sass",
    [
      'docusaurus-plugin-sentry',
      {
        DSN: 'efc31f19f9c54082b8d993bfb62eee57',
      },
    ],
    [
      '@docusaurus/plugin-google-analytics',
      {
        trackingID: 'UA-53373928-1',
        anonymizeIP: true,
      },
    ],
    require('./src/analytics-module')
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: false,
        docs: {
          showLastUpdateTime: true,
          breadcrumbs: true,
          routeBasePath: "/",
          remarkPlugins: [
            require("mdx-mermaid"),
            require('remark-math')
          ],
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
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha256-oWCabCfPd4Oi21wqZezBSz/anto4VYcJqc9sM9IzQTk=',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  ({
    docs: { 
      sidebar: { 
        autoCollapseCategories: false 
      },
    },
    navbar: {
      logo: {
        width: 100,
        src: "img/stellar-logo.svg",
        srcDark: "img/stellar-logo-dark.svg",
        href: "/",
      },
      items: [
        {
          to: '/',
          label: 'Docs',
          position: 'left'
        },
        {
          href: "https://developers.stellar.org/api",
          label: "API",
          position: "right",
        },
        {
          href: "https://github.com/stellar",
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
              href: "https://communityfund.stellar.org/"
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
              href: "https://status.stellar.org/"
            },
            {
              label: "Dashboard",
              href: "https://dashboard.stellar.org/",
            },
            { 
              label: "All Tools", 
              href: "https://developers.stellar.org/docs/tools-and-sdks/" 
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Developers Discord",
              href: "https://discord.gg/stellardev",
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
      ],
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
      additionalLanguages: ["java", "rust", "toml", "json5", "python"],
    },
  }),
};

module.exports = config;
