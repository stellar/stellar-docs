import React from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";

export const ExampleResponse = ({ children, title = "Example" }) => {
  const codeElement = children.props.children;

  return React.cloneElement(codeElement, {
    title,
    className: clsx(styles.ExampleResponse, codeElement.props.className),
  });
};
