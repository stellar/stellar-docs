// @ts-check

// const lightCodeTheme = require("prism-react-renderer/themes/nightOwl");
// const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
  plugins: ["docusaurus-plugin-sass"],
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
          // remarkPlugins: [require("mdx-mermaid")],
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/stellar/stellar-docs/tree/main/",
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
      }),
    ],

    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            // spec: 'openapi/multi-file/openapi.yaml',
            spec: 'openapi/main.yml',
            route: '/api/',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          // primaryColor: '#1890ff',
          options: { disableSearch: true },
        },
      },
    ],
  ],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  ({
    docs: { 
      sidebar: { 
        autoCollapseCategories: false 
      } 
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
          to: '/docs',
          label: 'Docs',
          position: 'left'
        },
        {
          to: '/api',
          label: 'API',
          position: 'left'
        },
        // {
        //   href: "https://developers.stellar.org/api",
        //   label: "API",
        //   position: "right",
        // },
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
    // TODO: update after site is deployed to production
    algolia: {
      appId: "testingPJZPDNR7VG",
      apiKey: "1f36375ebbc70d65c5b8165ecf52a1f2",
      indexName: "crawler_Docusaurus",
    },
    footer: {
      links: [
        {
          title: "Resources",
          items: [
            {
              label: "Get Started",
              href: "https://www.stellar.org/start",
            },
            {
              label: "Learn",
              href: "https://www.stellar.org/learn/intro-to-stellar",
            },
            {
              label: "Case Studies",
              href: "https://www.stellar.org/case-studies",
            },
            {
              label: "Stellar Quest",
              href: "https://quest.stellar.org/",
            },
          ],
        },
        {
          title: "Tools",
          items: [
            {
              label: "Account Viewer",
              href: "https://accountviewer.stellar.org/",
            },
            {
              label: "Laboratory",
              href: "https://laboratory.stellar.org/",
            },
            {
              label: "Dashboard",
              href: "https://dashboard.stellar.org/",
            },
            {
              label: "Ledger Explorer",
              href: "https://stellar.expert/explorer/public",
            },
            { label: "All Tools", href: "https://www.stellar.org/tools" },
          ],
        },
        {
          title: "Developers",
          items: [
            {
              label: "Developer Resources",
              href: "https://www.stellar.org/developers-legacy",
            },
            {
              label: "Status",
              href: "https://status.stellar.org/",
            },
            {
              label: "Technical Papers",
              to: "https://www.stellar.org/developers/guides/concepts/scp.html",
            },
            {
              label: "Developer Blog",
              href: "https://www.stellar.org/developers-blog",
            },
          ],
        },
      ],
    },
    prism: {
    //   theme: lightCodeTheme,
    //   darkTheme: darkCodeTheme,
      // additionalLanguages: ["java"],
    },
  }),
};

module.exports = config;
