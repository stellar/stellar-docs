import { useLayoutEffect, useState } from "react";
import { useSorobanReact } from "@soroban-react/core";

const useAuth = () => {
  const { address, connect, disconnect } = useSorobanReact();
  const [isConnected, setIsConnected] = useState(false);
  const addressString = address ? address.toString() : "No address";

  useLayoutEffect(() => {
    if (address) {
      localStorage.setItem(`isConnected:${address}`, "true");
    }
    const isConnectedFromStorage = localStorage.getItem(
      `isConnected:${addressString}`,
    );
    setIsConnected(!!isConnectedFromStorage);

    if (isConnectedFromStorage) {
      try {
        connect();
      } catch (error) {
        console.error("Error during connection:", error);
      }
    }
  }, [connect, address, addressString]);

  const connectUser = async () => {
    try {
      await connect();
      localStorage.setItem(`isConnected:${addressString}`, "true");
      setIsConnected(true);
    } catch (error) {
      console.error("Error during connection:", error);
    }
  };

  const disconnectUser = async () => {
    // TODO: Uncomment this when disconnect feature will be fully completed from @soroban-react/core side
    // try {
    //   await disconnect().then(() => {
    //     localStorage.removeItem(`isConnected:${addressString}`);
    //     setIsConnected(false);
    //   });
    // } catch (error) {
    //   console.error("Error during disconnection:", error);
    // }
  };

  return { address, isConnected, connectUser, disconnectUser };
};

export default useAuth;
