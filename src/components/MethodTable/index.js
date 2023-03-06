import React from "react";

import styles from "./styles.module.scss";

export const MethodTable = ({ children, title }) => (
  <div className={styles.MethodTable}>
    {title && <div className={styles.MethodTable__title}>{title}</div>}
    {children}
  </div>
);
