#!/usr/bin/env sh

perl -i -pe's/\.\.\/rpc(.*\.mdx)/..\/..\/..\/build\/guides\/rpc\1/g' docs/tools/cli/cookbook/*.mdx
perl -i -pe's/\.\.\/rpc(.*\.mdx)/..\/..\/..\/build\/guides\/rpc\1/g' i18n/es/docusaurus-plugin-content-docs/current/tools/cli/cookbook/*.mdx
