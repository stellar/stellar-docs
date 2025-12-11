import React, { type ReactNode } from "react";

import styles from "./styles.module.scss";

export function MethodTable({ children, title }): ReactNode {
  return (
    <div className={styles.MethodTable}>
      {title && <div className={styles.MethodTable__title}>{title}</div>}
      {children}
    </div>
  );
}
