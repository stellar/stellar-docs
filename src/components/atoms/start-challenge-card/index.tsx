import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

interface CardProps {
  addressHex: string;
}

export function ChallengeCard() {
  const redirectToChallenges = () => {
    window.location.href = "/dapps/category/challenges";
  };
  return (
    <div className={styles.card}>
      <h3>Start a Challenge</h3>
      <button className={styles.button} onClick={redirectToChallenges}>
        Start
      </button>
    </div>
  );
}
