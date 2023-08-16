import React from "react";
import styles from "./style.module.css";

export default function Leaderboard() {
  return (
    <div className={styles.leaderboard}>
      <div className={styles.leaderboardText}>
        <span>Stay tuned.</span>
        <strong>Leaderboard is coming soon!</strong>
      </div>

      <img
        src="/img/leaderboard-placeholder.png"
        alt="Leaderboard placeholder"
      />
    </div>
  );
}
