import React, { useMemo, useState } from "react";
import styles from "./style.module.css";
import { Challenge, ChallengeInfo } from "../../../interfaces/challenge";
import { ChallengeCard } from "../challenge-card";
import Switcher from "../UI/switcher";
import ConfirmModal from "../confirm-modal";

interface Props {
  availableChallenges: Challenge[];
  userChallenges: ChallengeInfo[];
  onRefresh: () => void;
  onReset?: () => void;
}

export default function ChallengeList({
  availableChallenges,
  userChallenges,
  onRefresh,
  onReset,
}: Props) {
  const [onlyMine, setOnlyMine] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const onResetClick = () => {
    setConfirmReset(true);
  };

  const onCancelClick = () => {
    setConfirmReset(false);
  };

  const myChallanges = (
    <>
      {userChallenges?.length ? (
        userChallenges?.map((challenge: ChallengeInfo) => {
          return <ChallengeCard challenge={challenge} key={challenge.id} />;
        })
      ) : (
        <p>You haven't completed any challenges yet.</p>
      )}
    </>
  );

  const allChallenges = useMemo(
    () =>
      availableChallenges?.map((aChall: Challenge) => {
        const inProgressChallenge = userChallenges.find(
          (uChall: ChallengeInfo) => uChall.id === aChall.id,
        );

        if (inProgressChallenge) {
          return (
            <ChallengeCard
              key={inProgressChallenge.id}
              challenge={inProgressChallenge}
            />
          );
        }

        return <ChallengeCard key={aChall.id} challenge={aChall} />;
      }),
    [availableChallenges, userChallenges],
  );

  return (
    <>
      <div className={styles.listHeader}>
        <div className={styles.dataControls}>
          {userChallenges?.length > 0 ? (
            <Switcher
              id="challengesFilter"
              labelText="Show my challenges"
              onChange={(value: boolean) => setOnlyMine(value)}
            />
          ) : null}
          <button className={styles.refreshBtn} onClick={onRefresh}>
            Refresh
          </button>
        </div>
        {onReset && (
          <button className={styles.resetBtn} onClick={onResetClick}>
            Reset
          </button>
        )}
      </div>

      <ul className={styles.challengeCards}>
        {onlyMine ? myChallanges : allChallenges}
      </ul>

      {confirmReset && onReset && (
        <ConfirmModal onCancel={onCancelClick} onReset={onReset} />
      )}
    </>
  );
}
