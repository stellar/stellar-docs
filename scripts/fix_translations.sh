#!/usr/bin/env sh

perl -i -pe's/\s\{/ \\{/g' i18n/es/docusaurus-plugin-content-docs/current/learn/fundamentals/transactions/list-of-operations.mdx
perl -i -pe's/<\s(.*\.mdx)>/\1/' i18n/es/docusaurus-plugin-content-docs-ap/**/admin-guide/component/observer/observer.mdx
