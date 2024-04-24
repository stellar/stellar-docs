import React from "react";
import styles from "./style.module.css";

interface Props {
  onCancel: () => void;
  onReset: () => void;
}

export default function ConfirmModal({ onCancel, onReset }: Props) {
  return (
    <>
      <div className={styles.blurContainer} onClick={onCancel}></div>
      <div className={styles.modalContainer}>
        <p className={styles.title}>Reseting progress!</p>
        It may take up to minute! <br />
        Are you sure you want to continue?
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.resetBtn} onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
