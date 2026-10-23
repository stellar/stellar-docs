# Before you edit the API reference

If you're here to fix Stellar's API documentation (first, thank you!), check
where the content actually comes from before editing:

- **Horizon endpoint pages** (`docs/data/apis/horizon/api-reference/*.mdx` with
  an `openapi:` line in their frontmatter) are rendered by Mintlify from the
  OpenAPI spec. Their parameters, responses, and examples live in
  `openapi/horizon/`. Edit the spec there, then run `pnpm api:bundle`.
- **Stellar RPC method pages**
  (`docs/data/apis/rpc/api-reference/methods/*.mdx`) are generated from the
  OpenRPC spec in `openrpc/`. Don't hand-edit the generated part of a page
  (between the `rpc-method` comments); see
  [`openrpc/README.md`](../../openrpc/README.md).
- Everything else here (guides, landing pages, and the prose around the
  generated parts) is edited directly.

See [CONTRIBUTING.md](../../CONTRIBUTING.md#api-reference-pages-are-generated)
for the full workflow.
