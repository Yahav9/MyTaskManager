import React from "react";

function ListCard(props) {
    return (
        <div draggable>
            <h3>{props.children}</h3>
            <i className="material-icons">delete</i>
        </div>
    )
}

export default ListCard;