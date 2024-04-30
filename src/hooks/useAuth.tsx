import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UserChallengesContext, {
  UserChallengesContextProps,
} from "../store/user-challenges-context";

// Import the Freighter library
import { isConnected, setAllowed, getPublicKey } from "@stellar/freighter-api";

const useAuth = () => {
  const { address, setAddress } = useContext<UserChallengesContextProps>(
    UserChallengesContext
  );

  const [loading, setLoading] = useState(false);

  const disconnect = () => {
    setAddress("");
  };

  const connect = async () => {
    try {
      setLoading(true);

      // Check if the user has Freighter installed
      if (await isConnected()) {
        // Prompt the user for authorization if needed
        await setAllowed();

        // Retrieve the user's public key
        const publicKey = await getPublicKey();

        // Store the user's public key in the context
        setAddress(publicKey);

        setLoading(false);

        return true;
      } else {
        // Handle the case where Freighter is not installed
        toast("Freighter is not installed!", {
          type: "error",
          hideProgressBar: true,
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }
    } catch (e) {
      console.error("Connection error", e);

      toast("Connection error!", {
        type: "error",
        hideProgressBar: true,
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }
  };

  const onConnectFreighter = () => {
    // Call the connect function to initiate the Freighter connection
    connect();
  };

  return {
    address,
    isConnected: !!address,
    loading,
    connect: onConnectFreighter,
    disconnect,
  };
};

export default useAuth;
