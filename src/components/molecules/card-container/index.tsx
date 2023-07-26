import React from "react";
import styles from "./style.module.css";
import { CompletedCoursesCard } from "../../atoms/courses-completed";
import { DeployedProjectsCard } from "../../atoms/courses-card";
import { UserCard } from "../../atoms/user-card";
import { ChallengeCard } from "../../atoms/start-challenge-card";

interface CardProps {
  addressHex: string;
}

export function CardContainer({ addressHex }: CardProps) {
  return (
    <div className={styles.container}>
      <div>
        <UserCard addressHex={addressHex} />
      </div>
      <div>
        <CompletedCoursesCard addressHex={addressHex} />
      </div>
      <div>
        <DeployedProjectsCard addressHex={addressHex} />
      </div>
      <div>
        <ChallengeCard />
      </div>
    </div>
  );
}
