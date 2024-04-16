import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import styles from "./style.module.css";
import useAuth from "../../../hooks/useAuth";
import UserChallengesContext, {
  UserChallengesContextProps,
} from "../../../store/user-challenges-context";
import { getActiveChallenge } from "../../../utils/get-active-challenge";
import {
  UserChallengeData,
  UpdateProgressData,
} from "../../../interfaces/challenge";
import {
  fetchUserProgress,
  updateUserProgress,
} from "../../../services/challenges";

interface StartChallengeButtonProps {
  id: number;
}

const startedToast = (
  <div className={styles.notification}>
    <img src="/icons/smiley-face-2.svg" alt="Smiley face" />
    <span className={styles.notificationText}>
      You’ve joined the challenge! Good luck!
    </span>
  </div>
);

export default function StartChallengeButton({
  id,
}: StartChallengeButtonProps) {
  const { address, isConnected, connect } = useAuth();
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setData, updateProgress } = useContext<UserChallengesContextProps>(
    UserChallengesContext,
  );

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserProgress(address?.toString() || "");
        const challenges = response.data.challenges || [];
        const challenge = getActiveChallenge(challenges, id);
        setData(challenges);
        setIsStarted(!!challenge?.startDate);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchProgress();
    }
  }, [address]);

  const startChallenge = async () => {
    const updatedItem: UpdateProgressData = {
      userId: address?.toString() || "",
      challengeId: id,
      challengeProgress: 0,
      startDate: Date.now(),
    };

    const response: AxiosResponse<UserChallengeData> = await updateUserProgress(
      updatedItem,
    );
    updateProgress(response.data.challenge);

    toast(startedToast, {
      hideProgressBar: true,
      position: "top-center",
      autoClose: 2000,
    });
    setIsStarted(true);
  };

  return (
    <button
      className={styles.button}
      onClick={isConnected ? startChallenge : connect}
      disabled={isStarted || isLoading}
    >
      {isConnected ? "Start Challenge" : "Connect Wallet"}
    </button>
  );
}
