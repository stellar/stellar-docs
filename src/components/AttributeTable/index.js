import React from "react";

import { ListItem } from "./ListItem";

import styles from "./styles.module.scss";

export const AttributeTable = ({ children }) => {

  let renderArray = []
  children.props.children
    .filter((child) => child !== "\n")
    .map((child) => {
      renderArray.push(
        <ListItem>{child}</ListItem>
      )
    })

  return (
    <div className={styles.AttributeTable}>
      {renderArray}
    </div>
  )
};
