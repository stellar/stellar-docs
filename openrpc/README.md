# Soroban RPC API Specification <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

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

## JSON-RPC

This is a specification of the API presented by Soroban RPC.

### Building

> _Note:_ The build process will provide an output file at
> `/static/openrpc.json`. This file should be included in any commits. However,
> this build process is re-run as part of our docusaurus deployment. So, it's
> necessary to update the actual source JSON files, and not just this built file
> as it will be overwritten at deploy time.

The specification is split into multiple files to improve readability. The
complete spec can be compiled into a single document as follows. (Run this
command from the root `soroban-docs` directory.)

```bash
yarn rpcspec:build
# Build successful.
```

This will output the file to `/static/openrpc.json`. This file will have all
schema `$ref`s resolved.

### Testing

We have included a script which will test and validate the generated
specification file.

```bash
yarn rpcspec:validate
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
related files. For example: `/src/examples/Transactions.json` hold several
`example` components that are related to transactions, such as transaction
hashes, results from the `getTransaction` or `sendTransaction` methods,
transactions parameters that were sent using the `sendTransaction` method, etc.

## Keeping Things Up-to-Date

**Don't making any changes to `openrpc.json` or `refs-openrpc.json`!** Any
changes you make there, will not be actually reflected in the generated
specification file. Instead, any changes should be made in the files contained
in the `/openrpc/src` directory.

This directory follows a structure similar to the schema defined in the OpenRPC
specification. Here are the pieces you'll need to know about:

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
complete example request to the Soroban RPC service. This is where you can
specify a set of `params` that were supplied in the request, as well as the
value(s) returned in the `result` from the node. The following properties are
required in the example pairing objects:

- `name` (string) - Name for the example pairing
- `params` (list) - A list of example parameters (or `$ref`s to example objects)
- `result` (example object) - Example result received from the node

> _Note:_ The `result` property is not technically _required_ by the open-rpc
> specification if the method is to be represented as a notification. However,
> Soroban RPC doesn't make use of any methods as notifications, so we've listed
> it as required here.

[method objects]: <https://spec.open-rpc.org/#method-object>
[contentDescriptor objects]:
    <https://spec.open-rpc.org/#content-descriptor-object>
[schema objects]: <https://spec.open-rpc.org/#schema-object>
[JSON Schema Specification 7]:
    <https://json-schema.org/draft-07/json-schema-release-notes.html>
[example objects]: <https://spec.open-rpc.org/#example-object>
[example pairing objects]: <https://spec.open-rpc.org/#example-pairing-object>
