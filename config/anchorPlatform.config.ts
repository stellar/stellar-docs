import type { PluginConfig } from '@docusaurus/types';
import type * as Plugin from '@docusaurus/types/src/plugin';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

export const anchorPlatformPluginInstances: PluginConfig[] = [
    [
        "docusaurus-plugin-openapi-docs",
        {
            id: "ap-apis",
            docsPluginId: 'ap',
            config: {
                ap_platform: {
                    specPath: "openapi/anchor-platform/bundled-platform.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/platform/transactions",
                    hideSendButton: true,
                    template: "src/template.mustache",
                } satisfies OpenApiPlugin.Options,
                ap_callbacks: {
                    specPath: "openapi/anchor-platform/bundled-callbacks.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/callbacks",
                    hideSendButton: true,
                    template: "src/template.mustache",
                } satisfies OpenApiPlugin.Options,
                ap_custody: {
                    specPath: "openapi/anchor-platform/bundled-custody.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/custody",
                    hideSendButton: true,
                    template: "src/template.mustache",
                } satisfies OpenApiPlugin.Options,
            } satisfies Plugin.PluginOptions,
        },
    ],
    [
        "@docusaurus/plugin-content-docs",
        {
            id: "ap",
            path: "platforms/anchor-platform",
            routeBasePath: "/platforms/anchor-platform",
            docItemComponent: "@theme/ApiItem",
            sidebarPath: "config/anchorPlatform.sidebar.ts",
            editUrl: "https://github.com/stellar/stellar-docs/tree/main",
            exclude: ['**/component/**', '**/README.md'],
            showLastUpdateTime: true,
            showLastUpdateAuthor: true,
        },
    ],
];
