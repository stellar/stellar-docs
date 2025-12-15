import fs from "fs";
import {
  parseOpenRPCDocument,
  validateOpenRPCDocument
} from "@open-rpc/schema-utils-js";

async function buildAndValidate(filename) {
  let rawdata = fs.readFileSync(filename);
  let openrpc = JSON.parse(rawdata);

  const error = validateOpenRPCDocument(openrpc);
  if (error != true) {
    console.log(error.name);
    console.log(error.message);
    process.exit(1);
  }

  try {
    await Promise.resolve(parseOpenRPCDocument(openrpc));
  } catch(e) {
    console.log(e.name);
    let end = e.message.indexOf("schema in question");
    let msg = e.message.substring(0, end);
    console.log(msg);
    process.exit(1);
  }

  console.log(`OpenRPC specfile (${filename}) validated successfully.`);
}

await Promise.all([
  buildAndValidate("openrpc/stellar-rpc.openrpc.json"),
  buildAndValidate("docs/platforms/anchor-platform/api-reference/platform/rpc/anchor-platform.openrpc.json")
])
