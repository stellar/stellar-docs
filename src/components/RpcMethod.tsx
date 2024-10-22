import Method from "@metamask/open-rpc-docs-react";
import React from "react";
import type { MethodObject } from "@open-rpc/meta-schema";

const CodeBlock = require('@theme/CodeBlock').default;
const Tabs = require('@theme/Tabs').default;
const TabItem = require('@theme/TabItem').default;

export const RpcMethod = ({ method }: { method: MethodObject}) => {
    return (<Method method={method} components={{CodeBlock, Tabs, TabItem}} />);
};
