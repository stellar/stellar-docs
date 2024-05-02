import React from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";

export const ExampleResponse = ({ children, title = "Example" }) => {
  console.log('ExampleResponse children', children);
  const codeElement = children.props.children;

  return React.cloneElement(codeElement, {
    title,
    className: clsx(styles.ExampleResponse, codeElement.props.className),
  });
};
