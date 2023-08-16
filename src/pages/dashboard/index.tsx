import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./style.module.css";
import { fetchInitialChallenges } from "../../services/challenges";
import useAuth from "../../hooks/useAuth";
import DashboardHeader from "../../components/atoms/dashboard-header";
import Leaderboard from "../../components/molecules/leaderboard";
import ChallengesList from "../../components/atoms/challenges-list";
import { Challenge } from "../../interfaces/challenge";

export default function Dashboard() {
  const [initialChallenges, setInitialChallenges] = useState<Challenge[]>();
  const [totalCompleted, setTotalCompleted] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address, isConnected, connectUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchInitialChallenges();
        setInitialChallenges(response.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [address]);

  return (
    <Layout>
      <div className={styles.dashboard}>
        {isConnected && address ? (
          <>
            <DashboardHeader challengesCompleted={totalCompleted} />
            <div className={styles.dashboardContent}>
              <Tabs>
                <TabItem value="Challenges">
                  <ChallengesList
                    isConnected={isConnected}
                    address={address}
                    initialChallenges={initialChallenges}
                    setTotalCompleted={setTotalCompleted}
                  />
                </TabItem>
                <TabItem value="Leaderboard">
                  <Leaderboard />
                </TabItem>
              </Tabs>
            </div>
          </>
        ) : (
          <>
            <div className={styles.dashboardContent}>
              {isLoading ? (
                <p>We're loading the list of challenges...</p>
              ) : (
                <ChallengesList
                  isConnected={isConnected}
                  address={address}
                  initialChallenges={initialChallenges}
                />
              )}
            </div>

            <div className={styles.dashboardFooter}>
              <strong>Want to take part in our challenges?</strong>
              <button className={styles.loginButton} onClick={connectUser}>
                Log in
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
