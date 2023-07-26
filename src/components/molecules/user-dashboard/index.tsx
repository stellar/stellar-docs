import React, { useEffect, useState } from "react";
import { CardContainer } from "../card-container";
import { useSorobanReact, SorobanReactProvider } from "@soroban-react/core";
import { SorobanEventsProvider } from "@soroban-react/events";
import { futurenet, sandbox, standalone, testnet } from "@soroban-react/chains";
import { freighter } from "@soroban-react/freighter";
import { ChainMetadata, Connector } from "@soroban-react/types";
import styles from "./style.module.css";
import BrowserOnly from "@docusaurus/BrowserOnly";

const chains: ChainMetadata[] = [sandbox, futurenet, testnet, standalone];
const connectors: Connector[] = [freighter()];

function LoginComponent() {
  const { address, activeChain, connect, disconnect } = useSorobanReact();
  const addressString = address ? address.toString() : "No address";
  const [loading, setLoading] = useState(true);

  // Check if the user is connected and stored the status in local storage
  useEffect(() => {
    let isConnected = localStorage.getItem(`isConnected:${addressString}`);
    if (isConnected === "true") {
      setLoading(false);
      connect(); // Call connect() to establish a connection if not already connected
    } else {
      setLoading(true);
    }
  }, [connect]);

  useEffect(() => {
    if (activeChain) {
      if (activeChain.name?.toString() !== "Futurenet") {
        alert("Please ensure that you are connected to Futurenet");
        setLoading(true);
      }
      if (activeChain.name?.toString() === undefined) {
        alert("Please ensure that you are connected to Futurenet");
        setLoading(true);
      }
      if (activeChain.name?.toString() === "Futurenet") {
        setLoading(false);
      }
    }
  }, [activeChain]);

  const handleConnect = async () => {
    try {
      await connect();
      setLoading(false);
      localStorage.setItem(`isConnected:${addressString}`, "true");
      let isConnected = localStorage.getItem(`isConnected:${addressString}`);
      console.log("isConnected:", isConnected);
    } catch (error) {
      console.error("Error during connection:", error);
    }
  };

  // const handleDisconnect = async () => {
  //   try {
  //     await disconnect();
  //     setLoading(true);
  //     localStorage.setItem(`isConnected:${addressString}`, "true");
  //     console.log("Disconnected!");
  //     let isConnected = localStorage.getItem(`isConnected:${addressString}`);
  //     console.log("isConnected:", isConnected);
  //   } catch (error) {
  //     console.error("Error during disconnection:", error);
  //   }
  // };

  if (loading) {
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          Please connect to Futurenet and click the Connect button to continue.
        </p>
        <button className={styles.button} onClick={handleConnect}>
          Connect
        </button>
      </div>
    );
  }

  return (
    <main className="">
      <div
        className="hp--hero"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContainer addressHex={addressString} />
        {/* <button className={styles.button} onClick={handleDisconnect}>
          Disconnect
        </button> */}
      </div>
    </main>
  );
}

export default function Login({ children }: { children: React.ReactNode }) {
  return (
    <SorobanReactProvider
      autoconnect={false}
      chains={chains}
      connectors={connectors}
      appName={"Login"}
    >
      <SorobanEventsProvider>
        {children}
        <BrowserOnly
          fallback={
            <div>
              Please connect to Futurenet and refresh the page to continue.
            </div>
          }
        >
          {() => <LoginComponent />}
        </BrowserOnly>
      </SorobanEventsProvider>
    </SorobanReactProvider>
  );
}
