Important: docusaurus is using bundled file. To generate bundled file use following command:
```bash
npx @redocly/cli@latest bundle main.yml --output bundled.yml
```

To re-build mdx files run

```bash
yarn docusaurus clean-api-docs all
yarn docusaurus gen-api-docs all 
```