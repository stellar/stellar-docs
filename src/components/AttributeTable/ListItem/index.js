import React from "react";
import Details from "@theme/Details";

import { combineAdjacentStrings, partition } from "@site/src/helpers";

import styles from "./styles.module.scss";

export const ListItem = (props) => {
  const children = props.children.props.children.filter((child) => child !== "\n");

  const [name, sublist] = children;

  const [typeElement, descriptionElement] = sublist.props.children.filter((child) => child !== "\n");

  const type =
  typeElement.props.children === "skip" ? null : typeElement.props.children;

  const [description, collapsedChildren] = partition(
    React.Children.toArray(descriptionElement.props.children),
    (child) => child?.type?.name !== "MDXUl" && child?.type?.name !== "ul",
  );

  const collapsedList = [];
  collapsedChildren.length > 0 && collapsedChildren[0].props.children
    .filter((child) => child !== "\n")
    .map((child, index) => {
      collapsedList.push(
        <ListItem key={`collapsedItem-${index}`}>{child}</ListItem>,
      );
    });

  return (
    <li className={styles.ListItem}>
      <p>
        <span className={styles.ListItem__name}>{name}</span>
        <span className={styles.ListItem__type}>{type}</span>
      </p>

      <p>{description}</p>

      {collapsedList.length > 0 && (
        <Details summary={<summary>Show child attributes</summary>}>
          {collapsedList}
        </Details>
      )}
    </li>
  );
};
