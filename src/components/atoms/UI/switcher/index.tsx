import React, { ChangeEvent, useState } from "react";
import styles from "./style.module.css";

interface SwitcherProps {
  id: string;
  labelText?: string;
  onChange?: (value: boolean) => void;
}

export default function Switcher({ id, labelText, onChange }: SwitcherProps) {
  const [isSwitched, setIsSwitched] = useState<boolean>(false);
  const switcherClasses = isSwitched
    ? `${styles.switcher} ${styles.switcherOn}`
    : styles.switcher;

  const changeHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsSwitched(target.checked);
    onChange && onChange(target.checked);
  };

  return (
    <div className={styles.switcherWrapper}>
      <span className={styles.switcherLabel}>{labelText}</span>

      <label htmlFor={id} className={switcherClasses} />
      <input
        type="checkbox"
        id={id}
        className={styles.switcherInput}
        onChange={changeHandler}
      />
    </div>
  );
}
