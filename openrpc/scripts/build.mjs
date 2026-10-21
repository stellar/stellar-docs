import fs from "fs";
import mergeAllOf from "json-schema-merge-allof";
import { dereferenceDocument } from "@open-rpc/schema-utils-js";
import defaultResolver from "@json-schema-tools/reference-resolver";

// Only *.json files are spec sources. This skips editor swap files and the like.
function jsonFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith(".json"));
}

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

async function buildSpecFile(serviceName) {
  // A service can reuse the components (schemas, content descriptors,
  // examples) of another service. Its own files are loaded last and win.
  const srcDirs = [
    ...(services[serviceName].componentsFrom ?? []),
    serviceName,
  ];

  let methods = [];
  let methodsBase = `openrpc/src/${serviceName}/methods/`
  if (fs.existsSync(methodsBase)) {
    let methodFiles = jsonFiles(methodsBase);
    methodFiles.forEach(file => {
      let raw = fs.readFileSync(methodsBase + file);
      let parsed = JSON.parse(raw);
      methods = [
        ...methods,
        parsed,
      ];
    });
  }

  let contentDescriptors = {};
  for (const dir of srcDirs) {
    let cdBase = `openrpc/src/${dir}/contentDescriptors/`;
    if (!fs.existsSync(cdBase)) continue;
    let cdFiles = jsonFiles(cdBase);
    cdFiles.forEach(file => {
      let raw = fs.readFileSync(cdBase + file);
      let parsed = JSON.parse(raw);
      contentDescriptors = {
        ...contentDescriptors,
        ...parsed,
      };
    });
  }

  let schemas = {};
  for (const dir of srcDirs) {
    let schemasBase = `openrpc/src/${dir}/schemas/`;
    if (!fs.existsSync(schemasBase)) continue;
    let schemaFiles = jsonFiles(schemasBase);
    schemaFiles.forEach(file => {
      let raw = fs.readFileSync(schemasBase + file);
      let parsed = JSON.parse(raw);
      schemas = {
        ...schemas,
        ...parsed,
      };
    });
  }

  let examples = {};
  for (const dir of srcDirs) {
    let examplesBase = `openrpc/src/${dir}/examples/`;
    if (!fs.existsSync(examplesBase)) continue;
    let examplesFiles = jsonFiles(examplesBase);
    examplesFiles.forEach(file => {
      let raw = fs.readFileSync(examplesBase + file)
      let parsed = JSON.parse(raw)
      examples = {
        ...examples,
        ...parsed,
      }
    })
  }

  let examplePairingObjects = {};
  for (const dir of srcDirs) {
    let epoBase = `openrpc/src/${dir}/examplePairingObjects/`;
    if (!fs.existsSync(epoBase)) continue;
    let epoFiles = jsonFiles(epoBase);
    epoFiles.forEach(file => {
      let raw = fs.readFileSync(epoBase + file)
      let parsed = JSON.parse(raw)
      examplePairingObjects = {
        ...examplePairingObjects,
        ...parsed,
      }
    })
  }

  const doc = {
    ...services[serviceName].starterFile,
    methods: sortByMethodName(methods),
    components: {
      contentDescriptors,
      schemas,
      examples,
      examplePairingObjects,
    },
  }

  fs.writeFileSync(`openrpc/${serviceName}.refs-openrpc.json`, JSON.stringify(doc, null, 2));

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
  fs.writeFileSync(`openrpc/${serviceName}.openrpc.json`, data);
  fs.writeFileSync(`${services[serviceName].saveDir ?? 'static'}/${serviceName}.openrpc.json`, data);

  console.log(`Built ${serviceName} specfile successfully.`);
}

const services = {
  'stellar-rpc': {
    starterFile: {
      openrpc: "1.2.6",
      info: {
        title: "Stellar RPC",
        description: "Stellar-RPC allows you to communicate directly with Soroban via a JSON RPC interface.",
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
        version: "27.1.1"
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
    },
  },
  'stellar-rpc-beta': {
    componentsFrom: ['stellar-rpc'],
    starterFile: {
      openrpc: "1.2.6",
      info: {
        title: "Stellar RPC (beta methods)",
        description: "Methods that are only served by the archive Stellar RPC node, which is in beta. These methods are in development and can change without notice.",
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
        version: "0.1.0"
      },
      servers: [],
    },
  },
  'anchor-platform': {
    saveDir: "docs/platforms/anchor-platform/api-reference/platform/rpc",
    starterFile: {
      openrpc: "1.2.6",
      info: {
        title: "Anchor Platform",
        description: "The Anchor Platform is a set of tools and APIs that enable developers and businesses to build their own on and off-ramp services for the Stellar network. It provides a standardized interface, including the implementation of several Stellar Ecosystem Proposals (SEPs), to make it easy for businesses to integrate with Stellar-based wallets and exchanges.",
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
        version: "2.8.4"
      },
      servers: [
        {
          name: "Platform API",
          url: "https://platform-server.exampleanchor.com",
          summary: "Example URL endpoint for the Platform Server.",
          description: "Example URL endpoint for the Platform Server. Note: This is an example URL only, you must configure your own Platform Server.",
        }
      ]
    }
  }
};

Object.keys(services).forEach(async (service) => {
  await buildSpecFile(service)
})
