import React, { type ReactNode } from "react";
import { ListItem } from "./ListItem";

import styles from "./styles.module.scss";

export function AttributeTable({ children }): ReactNode {
  const renderArray = [];
  children.props.children
    .filter((child) => child !== "\n")
    .map((child, index) => {
      renderArray.push(
        <ListItem key={`attributeItem-${index}`}>{child}</ListItem>,
      );
    });

  return (
    <div className={styles.AttributeTable}>
      {renderArray}
    </div>
  );
};
