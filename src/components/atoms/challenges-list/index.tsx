import React, { useCallback, useEffect, useState } from "react";
import styles from "./style.module.css";
import { Challenge, ChallengeInfo } from "../../../interfaces/challenge";
import { ChallengeCard } from "../challenge-card";
import { fetchUserProgress } from "../../../services/challenges";
import Switcher from "../UI/switcher";

interface ChallengesListProps {
  isConnected: boolean;
  address: string;
  initialChallenges: Challenge[];
  setTotalCompleted?: (amount: number) => void;
}

export default function ChallengesList({
  isConnected,
  address,
  initialChallenges,
  setTotalCompleted,
}: ChallengesListProps) {
  const [challenges, setChallenges] = useState<ChallengeInfo[] | Challenge[]>(
    [],
  );
  const [startedChallenges, setStartedChallenges] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOnlyMy, setShowOnlyMy] = useState<boolean>(false);
  const onlyMyList = (
    <>
      {challenges?.length ? (
        challenges?.map((challenge: ChallengeInfo) => {
          return <ChallengeCard challenge={challenge} key={challenge.id} />;
        })
      ) : (
        <p>You haven't completed any challenges yet.</p>
      )}
    </>
  );
  const listContentWithProgress = (
    <>
      {initialChallenges?.map((challenge: ChallengeInfo) => {
        if (!startedChallenges?.includes(challenge.id)) {
          return <ChallengeCard challenge={challenge} key={challenge.id} />;
        }

        const challengeWithProgress = challenges.find(
          (item: ChallengeInfo) => item.id === challenge.id,
        );
        return (
          <ChallengeCard challenge={challengeWithProgress} key={challenge.id} />
        );
      })}
    </>
  );

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchUserProgress(address);
      const challengeIds = response.data.challenges?.map(
        (item: ChallengeInfo) => item.id,
      );
      setChallenges(response.data.challenges || []);
      setTotalCompleted &&
        setTotalCompleted(response.data.completedChallenges || 0);
      setStartedChallenges(challengeIds);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      fetchProgress();
    }
  }, [isConnected, address, fetchProgress]);

  return (
    <>
      {isLoading ? (
        <p className="loading">We're loading the list of challenges...</p>
      ) : (
        <>
          <div className={styles.listHeader}>
            {challenges?.length > 0 ? (
              <Switcher
                id="challengesFilter"
                labelText="Show my challenges"
                onChange={(value: boolean) => setShowOnlyMy(value)}
              />
            ) : null}
            <button className={styles.refreshBtn} onClick={fetchProgress}>
              Refresh
            </button>
          </div>

          <ul className={styles.challengeCards}>
            {showOnlyMy ? onlyMyList : listContentWithProgress}
          </ul>
        </>
      )}
    </>
  );
}
