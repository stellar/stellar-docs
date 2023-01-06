import React from "react";
import Details from "@theme/Details";

import { combineAdjacentStrings, partition } from "@site/src/helpers";

import styles from "./styles.module.scss";

export const ListItem = (props) => {
  const children = combineAdjacentStrings(
    React.Children.toArray(props.children),
  );

  const [name, sublist] = children;

  const [typeElement, descriptionElement] = React.Children.toArray(
    sublist.props.children,
  );

  const type = typeElement.props.children;

  const temp = React.Children.toArray(descriptionElement.props.children);

  const [description, collapsedChildren] = partition(
    temp,
    (child) => child?.props?.mdxType !== "ul",
  );

  return (
    <li className={styles.ListItem}>
      <p>
        <span className={styles.ListItem__name}>{name}</span>
        <span className={styles.ListItem__type}>{type}</span>
      </p>

      <p>{description}</p>

      {collapsedChildren.length > 0 && (
        <Details summary={<summary>Show child attributes</summary>}>
          {collapsedChildren}
        </Details>
      )}
    </li>
  );
};
