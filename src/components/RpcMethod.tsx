import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import type { MethodObject } from "@open-rpc/meta-schema";

export const RpcMethod = ({ method }: { method: MethodObject}) => {
  return (
    <BrowserOnly fallback={<div>Loading method details…</div>}>
      {() => {
        const Method = require("@stellar/open-rpc-docs-react").default;
        const CodeBlock = require("@theme/CodeBlock").default;
        const Tabs = require("@theme/Tabs").default;
        const TabItem = require("@theme/TabItem").default;

        return <Method method={method} components={{ CodeBlock, Tabs, TabItem }} />;
      }}
    </BrowserOnly>
  );
};
