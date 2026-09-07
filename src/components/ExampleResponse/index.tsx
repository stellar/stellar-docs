import React, { type ReactNode } from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";
import Translate from "@docusaurus/Translate";

const translatedExample = (
  <Translate
    id='components.ExampleResponse.Example'
    description="The default title for a table of example API responses">
    Example
  </Translate>
)

export function ExampleResponse({ children, title = translatedExample }): ReactNode {
  const codeElement = children.props.children;

  return React.cloneElement(codeElement, {
    title,
    className: clsx(styles.ExampleResponse, codeElement.props.className),
  });
};
