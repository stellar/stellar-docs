#!/usr/bin/env sh

perl -i -pe's/\.\.\/rpc(.*\.mdx)/..\/..\/..\/build\/guides\/rpc\1/g' docs/tools/cli/cookbook/*.mdx
