#!/usr/bin/env sh

perl -i -pe's/\.\.\/rpc(.*?\.mdx)/..\/..\/..\/build\/guides\/rpc\1/g' docs/tools/cli/cookbook/*.mdx
perl -i -pe's/learn\/fundamentals\/networks.mdx/networks\/README.mdx/g' docs/tools/cli/cookbook/*.mdx
