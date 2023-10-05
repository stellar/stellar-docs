import React from "react";
import styles from "./style.module.css";
import { iconBulb, iconWallet } from "./challenge-icons";
import { ChallengeInfo } from "../../../interfaces/challenge";

interface ChallengeCardProps {
  challenge: ChallengeInfo;
}

interface ChallengeConfig {
  icon: JSX.Element;
  route: string;
  lastCheckpointRoute?: string;
}

enum ActionBtnTitle {
  SEE_DETAILS = "See details",
  CONTINUE = "Continue",
  PENDING = "Pending",
  COMPLETED = "Completed",
}

/* Config with challenge icon, page route and last checkpoint route in
case the challenge might have Pending status and require PR submission */
const challengeConfig: { [key: string]: ChallengeConfig } = {
  0: {
    icon: iconBulb,
    route: "/dapps/dapp-challenges/challenge-0-crowdfund",
    lastCheckpointRoute:
      "/dapps/dapp-challenges/challenge-0-crowdfund#checkpoint-7--check-your-work",
  },
  1: {
    icon: iconWallet,
    route: "/dapps/dapp-challenges/challenge-1-payment",
  },
  2: {
    icon: iconBulb,
    route: "/dapps/dapp-challenges/challenge-2-liquidity-pool",
  },
};
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { id, name, milestonesAmount: totalSteps } = challenge;
  let actionBtnTitle: ActionBtnTitle = ActionBtnTitle.SEE_DETAILS;
  let displayDate: string;
  const progressValue = (Number(challenge.progress) * 100) / totalSteps || 0;

  const setDisplayDate = (date: number) => {
    const resultDate = new Date(date);
    const month = months[resultDate.getUTCMonth()];
    const day = resultDate.getUTCDate();
    const year = resultDate.getUTCFullYear();

    return {
      month,
      day,
      year,
    };
  };

  if (challenge.startDate) {
    const { month, day, year } = setDisplayDate(challenge.startDate);
    actionBtnTitle = ActionBtnTitle.CONTINUE;
    displayDate = `Started on ${month}, ${day}, ${year}`;
  }

  if (challenge.completedAt) {
    const { month, day, year } = setDisplayDate(challenge.completedAt);
    actionBtnTitle = ActionBtnTitle.PENDING;
    displayDate = `Passed on ${month}, ${day}, ${year}`;
  }

  if (challenge.isCompleted) {
    const { month, day, year } = setDisplayDate(challenge.completedAt);
    actionBtnTitle = ActionBtnTitle.COMPLETED;
    displayDate = `Completed on ${month}, ${day}, ${year}`;
  }

  const showCompleteNote =
    actionBtnTitle === ActionBtnTitle.PENDING &&
    challengeConfig[id].lastCheckpointRoute;

  const shouldDisableAction =
    actionBtnTitle === ActionBtnTitle.COMPLETED ||
    actionBtnTitle === ActionBtnTitle.PENDING;

  return (
    <li className={styles.card}>
      <div className={styles.cardHeader}>
        {challengeConfig[id].icon}

        <div className={styles.progress}>{progressValue.toFixed()}/100%</div>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardTitle}>
          <a href={challengeConfig[id].route}>{name}</a>
        </p>

        <div className={styles.progressbar}>
          <div
            className={styles.progressLine}
            style={{ width: `${progressValue.toFixed()}%` }}
          />
          <div className={styles.slider} />
        </div>

        {showCompleteNote && (
          <p className={styles.cardNote}>
            In order to complete this challenge, check your CI/CD results on a
            pull request created on{" "}
            <a href={challengeConfig[id].lastCheckpointRoute}>
              this checkpoint
            </a>
          </p>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.date}>{displayDate}</span>

        <a
          className={styles.action}
          href={challengeConfig[id].route}
          aria-disabled={shouldDisableAction}
        >
          {actionBtnTitle}
        </a>
      </div>
    </li>
  );
}
