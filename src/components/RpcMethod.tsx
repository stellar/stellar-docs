import Method from "@ahalabs/open-rpc-docs-react";
import React from "react";

const CodeBlock = require('@theme/CodeBlock').default;
const Tabs = require('@theme/Tabs').default;
const TabItem = require('@theme/TabItem').default;

export const RpcMethod = ({ method, platform }) => {
    if (platform === 'soroban') {
        const rpcDoc = require('@site/static/openrpc.json');
        const rpcMethod = rpcDoc.methods.filter((meth: any) => meth.name === method)[0];
        return (<Method method={rpcMethod} components={{CodeBlock, Tabs, TabItem}} />);
    } 
        const rpcMethod = require(`@site/static/assets/rpc-methods/${method}.json`);
        return (<Method method={rpcMethod} components={{CodeBlock}}/>);
    
};
