import React, { PropsWithChildren } from "react";
import { futurenet, sandbox, standalone, testnet } from "@soroban-react/chains";
import { SorobanReactProvider } from "@soroban-react/core";
import { freighter } from "@soroban-react/freighter";
import { ChainMetadata, Connector } from "@soroban-react/types";
import { ToastContainer } from "react-toastify";
import UserChallengesContextProvider from "../store/UserChallengesContextProvider";
import "react-toastify/dist/ReactToastify.css";
import "./style.module.css";

const chains: ChainMetadata[] = [sandbox, futurenet, testnet, standalone];
const connectors: Connector[] = [freighter()];

export default function Root({ children }: PropsWithChildren) {
  return (
    <SorobanReactProvider
      autoconnect={false}
      chains={chains}
      connectors={connectors}
      appName="course completion"
    >
      <ToastContainer />

      <UserChallengesContextProvider>{children}</UserChallengesContextProvider>
    </SorobanReactProvider>
  );
}
