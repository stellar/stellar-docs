import React from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";
import Translate from "@docusaurus/Translate";

const transledExample = (
  <Translate
    id='components.ExampleResponse.Example'
    description="The default title for a table of example API responses">
    Example
  </Translate>
)

export const ExampleResponse = ({ children, title = transledExample }) => {
  const codeElement = children.props.children;

  return React.cloneElement(codeElement, {
    title,
    className: clsx(styles.ExampleResponse, codeElement.props.className),
  });
};
