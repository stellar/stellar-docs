import React from 'react';
import PathfindingRow from './PathfindingRow';
import styles from './styles.module.css'

export default function PathfindingTable({ children }) {
  return (
    React.Children.map(children, child => {
      if (child.type === 'table') {
        const [thead, tbody] = child.props.children
        const rows = tbody.props.children

        return (
          <table className={styles.PathfindingTable}>
            <thead>
              <tr>
                <th colSpan={3} {...thead.props.children.props.children[0].props}></th>
              </tr>
            </thead>
            <tbody>
              {React.Children.map(rows, row => <PathfindingRow row={row} />)}
            </tbody>
          </table>
        )
      } else {
        return child
      }
    })
  )
}
