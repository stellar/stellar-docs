import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { themes as prismThemes } from 'prism-react-renderer';

// import { makeEditUrl, DEFAULT_LOCALE, GOOGLE_TRANSLATE_ELEMENT } from './config/constants';
import navbarItems from './config/theme/navbar';
import footerColumns from './config/theme/footer';
import { headTags } from './config/theme/headTags';

import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Plugin from '@docusaurus/types/src/plugin';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

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
  favicon: "img/docusaurus/favicon-96x96.png",
  organizationName: "stellar",
  projectName: "stellar-docs",
  // i18n: {
  //   defaultLocale: DEFAULT_LOCALE,
  //   locales: ["en", "es"],
  // },
  scripts: [
    {
      src: 'https://translate.google.com/translate_a/element.js',
      async: true,
    },
  ],
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
          } satisfies OpenApiPlugin.Options,
          ap_platform: {
            specPath: "openapi/anchor-platform/bundled-platform.yaml",
            outputDir: "docs/platforms/anchor-platform/api-reference/platform/transactions",
            hideSendButton: true,
            template: "src/template.mustache",
          } satisfies OpenApiPlugin.Options,
          ap_callbacks: {
            specPath: "openapi/anchor-platform/bundled-callbacks.yaml",
            outputDir: "docs/platforms/anchor-platform/api-reference/callbacks",
            hideSendButton: true,
            template: "src/template.mustache",
          } satisfies OpenApiPlugin.Options,
          stellar_disbursement_platform: {
            specPath: "openapi/stellar-disbursement-platform/bundled.yaml",
            outputDir: "docs/platforms/stellar-disbursement-platform/api-reference",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: 'tag',
            },
            template: "src/template.mustache",
          } satisfies OpenApiPlugin.Options,
        } satisfies Plugin.PluginOptions,
      },
    ],
    './src/plugins/route-export/index.ts',
    './src/plugins/analytics-module/index.ts',
  ],
  markdown: {
    mermaid: true,
    mdx1Compat: {
      headingIds: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
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
          blogDescription: 'Notes and recordings from the Stellar protocol & developers meetings',
          blogSidebarTitle: 'All meetings',
          blogSidebarCount: 'ALL',
          postsPerPage: 12,
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
          // editUrl: makeEditUrl,
          editUrl: "https://github.com/stellar/stellar-docs/edit/main",
          exclude: ['**/component/**', '**/CONTRIBUTING.md'],
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
        gtag: {
          trackingID: "G-ZCT4GYX8KN",
          anonymizeIP: true,
        },
        googleTagManager: {
          containerId: "GTM-M2JLH37",
        },
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
  ],
  headTags: headTags,
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
    metadata: [
      { name: 'facebook-domain-verification', content: 'd0o7hha86jfxvtqyxz3d9i5wtfanmy' }
    ],
    navbar: {
      logo: {
        width: 100,
        src: "img/docusaurus/stellar-logo.svg",
        srcDark: "img/docusaurus/stellar-logo-dark.svg",
        href: "/",
      },
      items: [
        navbarItems.build,
        navbarItems.learn,
        navbarItems.tokens,
        navbarItems.data,
        navbarItems.tools,
        navbarItems.networks,
        navbarItems.validators,
        ...navbarItems.translation,
        {
          href: "https://github.com/stellar/stellar-docs",
          position: "right",
          className: "header-github-link",
          'aria-label': "GitHub",
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
        footerColumns.resources,
        footerColumns.tools,
        footerColumns.community,
        footerColumns.about,
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
