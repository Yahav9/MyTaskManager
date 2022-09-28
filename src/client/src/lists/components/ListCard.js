import React from "react";

function ListCard(props) {
    return (
        <div draggable>
            <a href={window.location.href + '/' + props.children}><h3>{props.children}</h3></a>
            <i
                className="material-icons"
                onClick={props.onDelete}
            >
                delete
            </i>
        </div>
    )
}

export default ListCard;