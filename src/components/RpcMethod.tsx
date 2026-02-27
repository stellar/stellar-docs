import Method from "@stellar/open-rpc-docs-react";
import React from "react";
import type { MethodObject } from "@open-rpc/meta-schema";

const CodeBlock = require("@theme/CodeBlock").default;
const Tabs = require("@theme/Tabs").default;
const TabItem = require("@theme/TabItem").default;

export function RpcMethod({ method }: { method: MethodObject }) {
  return <Method method={method} components={{ CodeBlock, Tabs, TabItem }} />;
}
