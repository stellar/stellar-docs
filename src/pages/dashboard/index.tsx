import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { toast } from "react-toastify";
import {
  LeaderboardParams,
  fetchLeaderboard,
} from "../../services/leaderboard";
import styles from "./style.module.css";
import {
  fetchInitialChallenges,
  fetchUserProgress,
  resetUserProgress,
} from "../../services/challenges";
import useAuth from "../../hooks/useAuth";
import DashboardHeader from "../../components/atoms/dashboard-header";
import Leaderboard from "../../components/molecules/leaderboard";
import ChallengesList from "../../components/atoms/challenges-list";
import {
  Challenge,
  ChallengeInfo,
  Leaderboard as LeaderboardI,
  Ranking,
} from "../../interfaces/challenge";

export default function Dashboard() {
  const { address, isConnected, connect } = useAuth();

  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>(
    [],
  );
  const [userChallenges, setUserChallenges] = useState<ChallengeInfo[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardI[]>([]);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [ranking, setRanking] = useState<Ranking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLeaderboardLoading, setIsLeaderboardLoading] =
    useState<boolean>(false);

  const fetchUserChallenges = async () => {
    setIsLoading(true);
    try {
      const result = await fetchUserProgress(address);
      setUserChallenges(result.data?.challenges || []);
      setTotalCompleted(result.data?.completedChallenges || 0);
      setRanking(result.data?.ranking || null);
    } catch (e) {
      toast("Something went wrong! Please reload", {
        type: "error",
        hideProgressBar: true,
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOnlyLeaderboard = async (params: LeaderboardParams) => {
    try {
      setIsLeaderboardLoading(true);
      const result = await fetchLeaderboard(params);
      setLeaderboard(result?.data);
    } catch (e) {
      toast("Something went wrong! Please reload", {
        type: "error",
        hideProgressBar: true,
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  const onReset = async () => {
    try {
      setIsLoading(true);
      await resetUserProgress(address);
    } catch (error) {
      toast("Something went wrong! Please try again", {
        type: "error",
        hideProgressBar: true,
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const result = await Promise.allSettled([
          fetchInitialChallenges(),
          fetchLeaderboard({}),
          fetchUserProgress(address),
        ]);

        if (result[0].status === "fulfilled") {
          setAvailableChallenges(result[0].value.data || []);
        }
        if (result[1].status === "fulfilled") {
          setLeaderboard(result[1].value.data || []);
        }
        if (result[2].status === "fulfilled") {
          setUserChallenges(result[2].value.data?.challenges || []);
          setTotalCompleted(result[2].value.data?.completedChallenges || 0);
          setRanking(result[2].value.data?.ranking || null);
        }

        if (
          result[0].status === "rejected" ||
          result[1].status === "rejected" ||
          result[2].status === "rejected"
        ) {
          throw new Error("Some request error");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast("Something went wrong! Please reload", {
          type: "error",
          hideProgressBar: true,
          position: "top-center",
          autoClose: 2000,
        });
      }
    };
    fetchData();
  }, [address]);

  return (
    <Layout>
      <div className={styles.dashboard}>
        {isConnected && address ? (
          <DashboardHeader
            totalCompleted={totalCompleted}
            ranking={ranking || 0} // Set ranking to 0 if it's not available
          />
        ) : null}

        <div className={styles.dashboardContent}>
          {isLoading ? (
            <p>We're loading the list of challenges...</p>
          ) : (
            <Tabs>
              <TabItem value="Challenges">
                <ChallengesList
                  availableChallenges={availableChallenges}
                  userChallenges={userChallenges}
                  onRefresh={fetchUserChallenges}
                  {...(userChallenges.length ? { onReset } : {})}
                />
              </TabItem>
              <TabItem value="Leaderboard">
                <Leaderboard
                  userId={address}
                  list={leaderboard}
                  onLoad={fetchOnlyLeaderboard}
                  isLoading={isLeaderboardLoading}
                />
              </TabItem>
            </Tabs>
          )}
        </div>

        {!isConnected || !address ? (
          <div className={styles.dashboardFooter}>
            <strong>Want to take part in our challenges?</strong>
            <button className={styles.loginButton} onClick={connect}>
              Log in
            </button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
