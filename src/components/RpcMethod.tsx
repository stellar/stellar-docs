import Method from "@metamask/open-rpc-docs-react";
import React from "react";

const CodeBlock = require('@theme/CodeBlock').default;

export const RpcMethod = ({ method }) => {
    const rpcMethod = require(`@site/static/assets/rpc-methods/${method}.json`);
    return (<Method method={rpcMethod} components={{CodeBlock}}/>);
};