# Stellar RPC API Specification <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

- [TL;DR](#tldr)
  - [Beta methods](#beta-methods)
- [JSON-RPC](#json-rpc)
  - [Building](#building)
  - [Testing](#testing)
  - [JSON `$ref`s](#json-refs)
- [Keeping Things Up-to-Date](#keeping-things-up-to-date)
  - [Methods (`/openrpc/src/methods/*`)](#methods-openrpcsrcmethods)
  - [Content Descriptors (`/openrpc/src/contentDescriptors/*`)](#content-descriptors-openrpcsrccontentdescriptors)
  - [Schemas (`/openrpc/src/schemas/*`)](#schemas-openrpcsrcschemas)
  - [Examples (`/openrpc/src/examples/*`)](#examples-openrpcsrcexamples)
  - [Example Pairings (`/openrpc/src/examplePairingObjects/*`)](#example-pairings-openrpcsrcexamplepairingobjects)

## TL;DR

If you're here to add a new method to one of the specfiles, you'll want to:

1. Create a new `<method_name>.json` file in the relevant
   `/openrpc/src/{stellar-rpc,anchor-platform}/methods` directory. Follow the
   OpenRPC specification concerning [method objects] for defining this file.
2. Feel free to use any existing (or create new) `$ref` objects along the way.
   More about them [later on](#json-refs).
3. Once your method is defined the way you want it, run the [build](#building)
   and [validate](#testing) scripts to generate updated "bundled" specfiles.
4. Get the method's page generated. Method pages are MDX generated from the
   bundled specfile (between `{/* rpc-method ... */}` and `{/* /rpc-method */}`
   comments), with any hand-written prose before or after the generated part.
   The generator isn't in this repo yet, so ask a maintainer to generate or
   regenerate the page. New pages also need an entry in `docs.json` navigation.
   Method pages live in:

   - For stellar-rpc: `/docs/data/apis/rpc/api-reference/methods`
   - For anchor-platform:
     `/docs/platforms/anchor-platform/api-reference/platform/rpc/methods`

### Beta methods

Methods that only the archive RPC node serves, and that can still change, go in
`/openrpc/src/stellar-rpc-beta/` instead of `/openrpc/src/stellar-rpc/`. They
build into a separate `/stellar-rpc-beta.openrpc.json`, so the main spec that
third parties consume stays unchanged. The beta service reuses every component
(schemas, content descriptors, examples) of `stellar-rpc`, so a beta method can
`$ref` things like `#/components/schemas/Event` directly. A beta method's page
is generated from the beta spec, and keeps a hand-written beta `<Warning>` above
the generated part.

When a beta method ships in a general RPC release:

1. Move its files from `/openrpc/src/stellar-rpc-beta/` into the matching
   directories under `/openrpc/src/stellar-rpc/`. Merge or replace any
   beta-local override that shares a name with a main spec component.
2. Regenerate the method's page from the main spec.
3. Remove the beta `<Warning>` from the page and any beta mentions that link to
   it.
4. Remove the `stellar-rpc-beta` service from `scripts/build.mjs` and
   `scripts/validate.mjs` if no beta method remains.

## JSON-RPC

These are specifications of the APIs presented by Stellar RPC and the Platform
Server component of the Anchor Platform.

### Building

> _Note:_ The build process writes `/stellar-rpc.openrpc.json`,
> `/stellar-rpc-beta.openrpc.json`, and
> `/docs/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json`.
> Commit these files along with your source changes: nothing rebuilds them at
> deploy time, and the site serves the committed copies (for example at
> `https://developers.stellar.org/stellar-rpc.openrpc.json`). Always change the
> source JSON files too, not just the built files, or the next build overwrites
> your edit.

The specification is split into multiple files to improve readability. The
complete spec can be compiled into a single document as follows. (Run this
command from the root of this repository.)

```bash
pnpm rpcspec:build
# Build successful.
```

This will output the files listed in the note above. These files will have all
schema `$ref`s resolved.

### Testing

We have included a script which will test and validate the generated
specification file.

```bash
pnpm rpcspec:validate
# OpenRPC spec validated successfully.
```

### JSON `$ref`s

These files make extensive use of `$ref` objects for improved readability and
maintainability. In the separate files, the references don't mean much, but when
things are generated they'll be resolved. If you are going to reference
something in the specification, you will need to use the following format:
`#/components/{schemas,examples,etc.}/NameOfComponentToReference`.

The items broken out into objects that will be referenced are not held
individually in their own files. Instead, they are grouped into similar and
related files. For example: `/src/examples/Transactions.json` holds several
`example` components that are related to transactions, such as transaction
hashes, results from the `getTransaction` or `sendTransaction` methods,
transactions parameters that were sent using the `sendTransaction` method, etc.

## Keeping Things Up-to-Date

**Don't making any changes to `*.openrpc.json` or `*.refs-openrpc.json`!** Any
changes you make there, will not be reflected in the generated specification
files. Instead, any changes should be made in the files contained in the
`/openrpc/src/{stellar-rpc,anchor-platform}` directories.

These directories follow a structure similar to the schema defined in the
OpenRPC specification. Here are the pieces you'll need to know about:

### Methods (`/openrpc/src/methods/*`)

This collection of JSON files define the [method objects] that will go into the
generated specification file. The methods can be considered the container that
will ultimately hold _all_ of the details about how the method works (parameter
types, return types, examples, etc.). The following properties are required in
the method object:

- `name` (string) - The canonical name for the method. The name MUST be unique
  within the methods array
- `params` (list) - A list of parameters that are applicable for this method

### Content Descriptors (`/openrpc/src/contentDescriptors/*`)

This collection of JSON files define the [contentDescriptor objects] that will
go into the generated specification file. A content descriptor is a reusable way
of describing either parameters or results. (Though, I've found they're best
used as items in a method's `params` list). The following property are required
in the content descriptor object:

- `name` (string) - Name of the content that is being described. If this object
  is defining a parameter, the `name` field will define the parameter's key
- `schema` (object) - A schema that describes the content

### Schemas (`/openrpc/src/schemas/*`)

This collection of JSON files define the [schema objects] that will go into the
generated specification file. These schemas allow us to define input and output
data types. These schemas **MUST** follow the [JSON Schema Specification 7]

### Examples (`/openrpc/src/examples/*`)

This collection of JSON files define the [example objects] that will go into the
generated specification file. These objects define an example that is consistent
and matches the `schema` of a given content descriptor. These example objects
can act as either a parameter or result. The `value` property of the example
object allows us to embed a literal example of what the schema can look like.

### Example Pairings (`/openrpc/src/examplePairingObjects/*`)

This collection of JSON files define the [example pairing objects] that will go
into the generated specification file. The example pairing objects make up a
complete example request to the Stellar RPC service. This is where you can
specify a set of `params` that were supplied in the request, as well as the
value(s) returned in the `result` from the node. The following properties are
required in the example pairing objects:

- `name` (string) - Name for the example pairing
- `params` (list) - A list of example parameters (or `$ref`s to example objects)
- `result` (example object) - Example result received from the node

> _Note:_ The `result` property is not technically _required_ by the open-rpc
> specification if the method is to be represented as a notification. However,
> Stellar RPC doesn't make use of any methods as notifications, so we've listed
> it as required here.

[method objects]: https://spec.open-rpc.org/#method-object
[contentDescriptor objects]:
  https://spec.open-rpc.org/#content-descriptor-object
[schema objects]: https://spec.open-rpc.org/#schema-object
[JSON Schema Specification 7]:
  https://json-schema.org/draft-07/json-schema-release-notes.html
[example objects]: https://spec.open-rpc.org/#example-object
[example pairing objects]: https://spec.open-rpc.org/#example-pairing-object
