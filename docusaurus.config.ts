import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { themes as prismThemes } from 'prism-react-renderer';

import { makeEditUrl, DEFAULT_LOCALE } from './config/constants';
import { anchorPlatformPluginInstances } from './config/anchorPlatform.config';
import { disbursementPlatformPluginInstances } from './config/disbursementPlatform.config';
import navbarItems from './config/theme/navbar';
import footerColumns from './config/theme/footer';

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
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://use.fontawesome.com/221fd444f5.js',
    'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',
  ],
  plugins: [
    () => ({
      name: 'google-translate-init',
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'script',
              innerHTML: `
                function googleTranslateElementInit() {}
              `,
            },
          ],
        };
      },
    }),
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
        navbarItems.build,
        navbarItems.learn,
        navbarItems.tokens,
        navbarItems.data,
        navbarItems.tools,
        navbarItems.networks,
        navbarItems.validators,
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'ap',
          dropdownActiveClassDisabled: true,
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
          type: 'html',
          position: 'right',
          value:
            '<div id="google_translate_element" style="display:inline-block"></div><a class="navbar__link false" href="#" onclick="new google.translate.TranslateElement({pageLanguage: \'en\', includedLanguages: \'af,sq,am,en,fa,ar,ps,ja,zh-CN,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,zh-TW,co,hr,cs,da,nl,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu\'}, \'google_translate_element\'); return false;"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="vertical-align: text-bottom"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></svg></a>',
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
