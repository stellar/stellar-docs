import React from "react";
import styles from "./style.module.css";

interface CardProps {
  addressHex: string;
}

export function UserCard({ addressHex }: CardProps) {
  
  return (
    <div className={styles.card}>
      <h3>Address</h3>
      <p>{addressHex}</p>
    </div>
  );
}
