import React from "react"

const SortableRow = (props) => {
    return (
        <tr>
            <td>{props.title}</td>
            <td><a href={props.href}>click here</a></td>
            <td><a href={`/docs/tags/${props.difficulty}`}>{props.difficulty}</a></td>
        </tr>
    )
}

export default SortableRow
