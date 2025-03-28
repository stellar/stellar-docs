#!/usr/bin/env sh

perl -i -pe's/\s\{/ \\{/g' i18n/es/docusaurus-plugin-content-docs/current/learn/fundamentals/transactions/list-of-operations.mdx
perl -i -pe's/<\s(.*\.mdx)>/\1/' i18n/es/docusaurus-plugin-content-docs-ap/**/admin-guide/component/observer/observer.mdx
find i18n/es/docusaurus-plugin-content-docs/current -type f -print0 | xargs -0 perl -i -pe's/{\/_/{\/\*/'
find i18n/es/docusaurus-plugin-content-docs/current -type f -print0 | xargs -0 perl -i -pe's/_\/}/\*\/}/'
