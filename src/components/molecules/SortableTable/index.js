import React, { useState } from "react"
import styles from "./style.module.css";

const arrowDown = <span style={{ fontSize: "10px" }}>&#9660;</span>;
const arrowUp = <span style={{ fontSize: "10px" }}>&#9650;</span>;

const SortableTable = (props) => {
    const [isAscending, setIsAscending] = useState(false);
    const [sortColumn, setSortColumn] = useState(null)

    const sortTable = (val) => {
        const sortDirection = col === val ?  !isAscending : false
        setIsAscending(sortDirection)
        setSortColumn(val)
    }

    return (
        <table className={styles.sortable}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Link</th>
                    <th>Tags</th>
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    )
}

export default SortableTable
