import fs from "fs";
import mergeAllOf from "json-schema-merge-allof";
import { dereferenceDocument } from "@open-rpc/schema-utils-js";
import defaultResolver from "@json-schema-tools/reference-resolver";

function sortByMethodName(methods) {
  return methods.slice().sort((a, b) => {
    if (a['name'] > b['name']) {
      return 1;
    } else if (a['name'] < b['name']) {
      return -1;
    } else {
      return 0;
    }
  })
}

let methods = [];
let methodsBase = "openrpc/src/methods/";
let methodFiles = fs.readdirSync(methodsBase);
methodFiles.forEach(file => {
  let raw = fs.readFileSync(methodsBase + file);
  let parsed = JSON.parse(raw);
  methods = [
    ...methods,
    parsed,
  ];
});

let contentDescriptors = {};
let cdBase = "openrpc/src/contentDescriptors/";
let cdFiles = fs.readdirSync(cdBase);
cdFiles.forEach(file => {
  let raw = fs.readFileSync(cdBase + file);
  let parsed = JSON.parse(raw);
  contentDescriptors = {
    ...contentDescriptors,
    ...parsed,
  };
});

let schemas = {};
let schemasBase = "openrpc/src/schemas/"
let schemaFiles = fs.readdirSync(schemasBase);
schemaFiles.forEach(file => {
  let raw = fs.readFileSync(schemasBase + file);
  let parsed = JSON.parse(raw);
  schemas = {
    ...schemas,
    ...parsed,
  };
});

let examples = {}
let examplesBase = "openrpc/src/examples/"
let examplesFiles = fs.readdirSync(examplesBase)
examplesFiles.forEach(file => {
  let raw = fs.readFileSync(examplesBase + file)
  let parsed = JSON.parse(raw)
  examples = {
    ...examples,
    ...parsed,
  }
})

let examplePairingObjects = {}
let epoBase = "openrpc/src/examplePairingObjects/"
let epoFiles = fs.readdirSync(epoBase)
epoFiles.forEach(file => {
  let raw = fs.readFileSync(epoBase + file)
  let parsed = JSON.parse(raw)
  examplePairingObjects = {
    ...examplePairingObjects,
    ...parsed,
  }
})

const doc = {
  openrpc: "1.2.4",
  info: {
    title: "Soroban RPC",
    description: "Soroban-RPC allows you to communicate directly with Soroban via a JSON RPC interface.",
    termsOfService: "https://stellar.org/terms-of-service",
    contact: {
      name: "Stellar Development Foundation",
      url: "https://stellar.org/connect",
      email: "hello@stellar.org"
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html"
    },
    version: "20.1.0"
  },
  servers: [
    {
      name: "Testnet",
      url: "https://soroban-testnet.stellar.org:443",
      summary: "Publicly available RPC server maintained by SDF, operating on the Testnet test network.",
      description: "Testnet is meant to be a stable network that runs a production (or near-production) version of the Stellar network."
    },
    {
      name: "Futurenet",
      url: "https://rpc-futurenet.stellar.org:443",
      summary: "Publicly available RPC server maintained by SDF, operating on the Futurenet test network.",
      description: "Futurenet is meant to be a bleeding-edge, experimental network that runs an early, test version of the Stellar network."
    }
  ],
  methods: sortByMethodName(methods),
  components: {
    contentDescriptors: contentDescriptors,
    schemas: schemas,
    examples: examples,
    examplePairingObjects: examplePairingObjects,
  },
}

fs.writeFileSync('openrpc/refs-openrpc.json', JSON.stringify(doc, null, 2));

let spec = await dereferenceDocument(doc, defaultResolver.default)

spec.components = {};

// Merge instances of `allOf` in methods.
for (var i=0; i < spec.methods.length; i++) {
  for (var j=0; j < spec.methods[i].params.length; j++) {
    spec.methods[i].params[j].schema = mergeAllOf(spec.methods[i].params[j].schema);
  }
  spec.methods[i].result.schema = mergeAllOf(spec.methods[i].result.schema);
}

let data = JSON.stringify(spec, null, 2);
fs.writeFileSync('openrpc/openrpc.json', data);
fs.writeFileSync('static/openrpc.json', data);

console.log();
console.log("Build successful.");
