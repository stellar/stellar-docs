import React from "react";
import { MDXProvider } from "@mdx-js/react";

import { ListItem } from "./ListItem";

import styles from "./styles.module.scss";

export const AttributeTable = ({ children }) => (
  <div className={styles.AttributeTable}>
    <MDXProvider components={{ li: ListItem }}>
      {React.Children.only(children)}
    </MDXProvider>
  </div>
);
