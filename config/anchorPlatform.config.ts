import type { PluginConfig } from '@docusaurus/types';
import versions from '../ap_versions.json'
import type * as Plugin from '@docusaurus/types/src/plugin';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';
import type { APIVersionOptions } from 'docusaurus-plugin-openapi-docs/src/types';

const anchorPlatformNextVersion: string = "3.0.0"

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
                    version: anchorPlatformNextVersion,
                    label: `v${anchorPlatformNextVersion}`,
                    baseUrl: '/platforms/anchor-platform/next/api-reference/platform/transactions',
                    versions: makeVersions('platform')
                } satisfies OpenApiPlugin.Options,
                ap_callbacks: {
                    specPath: "openapi/anchor-platform/bundled-callbacks.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/callbacks",
                    hideSendButton: true,
                    template: "src/template.mustache",
                    version: anchorPlatformNextVersion,
                    label: `v${anchorPlatformNextVersion}`,
                    baseUrl: "/platforms/anchor-platform/next/api-reference/callbacks",
                    versions: makeVersions('callbacks')
                } satisfies OpenApiPlugin.Options,
                ap_custody: {
                    specPath: "openapi/anchor-platform/bundled-custody.yaml",
                    outputDir: "platforms/anchor-platform/api-reference/custody",
                    hideSendButton: true,
                    template: "src/template.mustache",
                    version: anchorPlatformNextVersion,
                    label: `v${anchorPlatformNextVersion}`,
                    baseUrl: "/platforms/anchor-platform/next/api-reference/custody",
                    versions: makeVersions('custody')
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

/**
 * Dynamically make the versions object for each of the AP servers.
 *
 * These all follow a nearly identical patterns, so it's a lot of duplicated
 * config to individually declare everything in the plugins. This function will
 * read the "released" versions from the `ap_versions.json` file and generate
 * the correct configuration for each of the versions found in that array.
 */
function makeVersions(server: ('platform'|'callbacks'|'custody')): {[key: string]: APIVersionOptions} {
    const baseUrls = {
        platform: "/platforms/anchor-platform/api-reference/platform/transactions",
        callbacks: "/platforms/anchor-platform/api-reference/callbacks",
        custody: "/platforms/anchor-platform/api-reference/custody",
    }

    const versionsObject: {[key: string]: APIVersionOptions} = {}
    versions.forEach((vString) => {
        versionsObject[vString] = {
            specPath: `openapi/anchor-platform/versions/${server}-${vString}.yaml`,
            outputDir: `ap_versioned_docs/version-${vString}/api-reference/${server === 'platform' ? 'platform/transactions': server}`,
            label: `v${vString}`,
            baseUrl: baseUrls[server]
        }
    })

    return versionsObject
}
