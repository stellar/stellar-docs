import { makeEditUrl } from './constants';

import type { PluginConfig } from '@docusaurus/types';
import type * as Plugin from '@docusaurus/types/src/plugin';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

export const disbursementPlatformPluginInstances: PluginConfig[] = [
    [
        "docusaurus-plugin-openapi-docs",
        {
            id: "sdp-apis",
            docsPluginId: 'sdp',
            config: {
                stellar_disbursement_platform: {
                    specPath: "openapi/stellar-disbursement-platform/bundled.yaml",
                    outputDir: "platforms/stellar-disbursement-platform/api-reference",
                    sidebarOptions: {
                        groupPathsBy: "tag",
                        categoryLinkSource: 'tag',
                    },
                    template: "src/template.mustache",
                } satisfies OpenApiPlugin.Options,
            } satisfies Plugin.PluginOptions,
        },
    ],
    [
        "@docusaurus/plugin-content-docs",
        {
            id: "sdp",
            path: "platforms/stellar-disbursement-platform",
            routeBasePath: "/platforms/stellar-disbursement-platform",
            docItemComponent: "@theme/ApiItem",
            sidebarPath: "config/disbursementPlatform.sidebar.ts",
            editUrl: makeEditUrl,
            exclude: ['**/component/**', '**/README.md'],
            showLastUpdateTime: true,
            showLastUpdateAuthor: true,
        },
    ],
];
