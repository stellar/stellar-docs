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
                    version: "3.0.0",
                    label: "v3.0.0",
                    baseUrl: '/platforms/anchor-platform/next/api-reference/platform/transactions',
                    versions: {
                        "2.8.4": {
                            specPath: "openapi/anchor-platform/versions/platform-2.8.4.yaml",
                            outputDir: "ap_versioned_docs/version-2.8.4/api-reference/platform/transactions",
                            label: "v2.8.4",
                            baseUrl: "/platforms/anchor-platform/api-reference/platform/transactions"
                        }
                    }
                } satisfies OpenApiPlugin.Options,
                ap_callbacks: {
                    specPath: "openapi/anchor-platform/bundled-callbacks.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/callbacks",
                    hideSendButton: true,
                    template: "src/template.mustache",
                    version: "3.0.0",
                    label: "v3.0.0",
                    baseUrl: "/platforms/anchor-platform/next/api-reference/callbacks",
                    versions: {
                        "2.8.4": {
                            specPath: "openapi/anchor-platform/versions/callbacks-2.8.4.yaml",
                            outputDir: "ap_versioned_docs/version-2.8.4/api-reference/callbacks",
                            label: "v2.8.4",
                            baseUrl: "/platforms/anchor-platform/api-reference/callbacks"
                        }
                    }
                } satisfies OpenApiPlugin.Options,
                ap_custody: {
                    specPath: "openapi/anchor-platform/bundled-custody.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/custody",
                    hideSendButton: true,
                    template: "src/template.mustache",
                    version: "3.0.0",
                    label: "v3.0.0",
                    baseUrl: "/platforms/anchor-platform/next/api-reference/custody",
                    versions: {
                        "2.8.4": {
                            specPath: "openapi/anchor-platform/versions/custody-2.8.4.yaml",
                            outputDir: "ap_versioned_docs/version-2.8.4/api-reference/custody",
                            label: "v2.8.4",
                            baseUrl: "/platforms/anchor-platform/api-reference/custody"
                        }
                    }
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
