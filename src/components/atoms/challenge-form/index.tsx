import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { useSorobanReact, SorobanReactProvider } from "@soroban-react/core";
import { SorobanEventsProvider } from "@soroban-react/events";
import { futurenet, sandbox, standalone, testnet } from "@soroban-react/chains";
import { freighter } from "@soroban-react/freighter";
import { ChainMetadata, Connector } from "@soroban-react/types";
import BrowserOnly from "@docusaurus/BrowserOnly";

const chains: ChainMetadata[] = [sandbox, futurenet, testnet, standalone];
const connectors: Connector[] = [freighter()];

interface ChallengeFormProps {
  courseId: number;
  address?: string;
}

function ChallengeForm2({ address, courseId }: ChallengeFormProps) {
  const [savedUrl, setSavedUrl] = useState("");
  const [url, setUrl] = useState("");
  const [courseIdState] = useState(courseId);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  interface Course {
    publickey: string;
    course_index: number;
    url: string;
  }

  const fetchCourseUrl = async (
    address: string,
    courseId: number,
  ): Promise<string> => {
    try {
      const response = await fetch(
        "https://soroban-dapps-challenge-wrangler.sdf-ecosystem.workers.dev",
      );
      const rawData = await response.json();
      const data: Course[] = rawData.map(
        ({ publickey, url }: { publickey: string; url: string }) => {
          const [key, course_index] = publickey.split(":");
          return { publickey: key, course_index: Number(course_index), url };
        },
      );

      // Get the first course that matches the public key and course id
      const course = data.find(
        (course) =>
          course.publickey === address && course.course_index === courseId,
      );
      return course ? course.url : "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  useEffect(() => {
    if (address) {
      fetchCourseUrl(address, courseId).then(setUrl);
      fetchCourseUrl(address, courseId).then(setSavedUrl);
    }
  }, [address, courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!url.includes(".vercel.app")) {
        alert('URL must contain ".vercel.app" to complete the checkpoint.');
        return;
      }

      const response = await fetch(
        "https://soroban-dapps-challenge-wrangler.sdf-ecosystem.workers.dev",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publickey: address,
            url: url,
            course_index: [courseIdState],
          }),
        },
      );

      if (response.ok) {
        // Request succeeded, handle the response
        const data = response;
        console.log(data);
        setIsSubmittedSuccessfully(true);
      } else {
        // Request failed, handle the error
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      // Handle or log the error here
      console.error(error);
    }
  };

  // Show the form if it's not submitted successfully
  if (!isSubmittedSuccessfully) {
    return (
      <div>
        <form onSubmit={handleSubmit} className={styles.challengeform}>
          <label>
            Public URL:
            <input
              className={styles.input}
              type="url"
              value={url}
              onChange={(e) => {
                const url = e.target.value;
                setUrl(url);
                console.log("URL:", url);
                console.log("Public Key:", address);
              }}
              required
            />
          </label>
          <button type="submit" className={styles.button}>
            {savedUrl ? "Resubmit" : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  // Show the clickable entry if the form is submitted successfully
  return (
    <div>
      <p className={styles.success}>
        Challenge Complete! Dapp deployed to: <a href={url}>{url}</a>
      </p>
    </div>
  );
}

function InnerComponent({ courseId }: { courseId: number }) {
  const { address, connect, activeChain } = useSorobanReact();
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
      if (activeChain.name?.toString() === "Futurenet" && address) {
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

  // if user is not logged in (address is undefined), render the Login button
  if (loading) {
    return (
      <div style={{ fontWeight: "bold" }}>
        Please connect to Futurenet and click the Connect button to continue.
        <br />
        <br />
        <button className={styles.button} onClick={handleConnect}>
          Connect
        </button>
      </div>
    );
  }
  // if user is logged in and connected to the right network, render the ChallengeForm
  return <ChallengeForm2 address={address} courseId={courseId} />;
}

export function ParentChallengeForm({ courseId }: { courseId: number }) {
  return (
    <SorobanReactProvider
      autoconnect={false}
      chains={chains}
      connectors={connectors}
      appName={"course completion"}
    >
      <SorobanEventsProvider>
        <BrowserOnly
          fallback={
            <div>
              Please connect to Futurenet and refresh the page to continue.
            </div>
          }
        >
          {() => <InnerComponent courseId={courseId} />}
        </BrowserOnly>
      </SorobanEventsProvider>
    </SorobanReactProvider>
  );
}
