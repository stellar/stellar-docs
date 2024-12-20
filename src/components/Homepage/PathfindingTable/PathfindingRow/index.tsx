import React from "react";
import styles from './styles.module.css'
import clsx from "clsx";

const BADGE_CATEGORIES: Record<string, string> = {
  Learn: 'warning',
  Guide: 'primary',
  Tool: 'success',
  Example: 'info',
  Tutorial: 'danger',
  Data: 'secondary',
}

export default function PathfindingRow({ row }) {
  const [linkTd, descTd, badgeTd] = row.props.children

  const description = descTd.props.children
  const badgeCategory = badgeTd.props.children

  return (
    <tr>
      <td className={styles.LinkColumn} {...linkTd.props}></td>
      <td className={styles.DescColumn}>
        <div className={clsx(styles.DescColumnInner)}>
          <span>{description}</span>
          <span className={clsx('badge', `badge--${BADGE_CATEGORIES[badgeCategory]}`)}>{badgeCategory}</span>
        </div>
      </td>
    </tr>
  )
}
