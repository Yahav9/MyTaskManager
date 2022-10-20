import React, { useState } from "react";

function TaskCard(props) {
    const [checkBox, setCheckBox] = useState('check_box_outline_blank')

    const onCheckBoxClick = () => {
        if (checkBox === 'check_box_outline_blank') {
            setCheckBox('check_box')
        } else {
            setCheckBox('check_box_outline_blank')
        }
    }

    return (
        <div draggable>
            <i
                className="material-icons"
                onClick={onCheckBoxClick}>{checkBox}</i>
            <h3>{props.children}</h3>
            <i className="material-icons">delete</i>
            <i className="material-icons">edit</i>
        </div>
    )
}

export default TaskCard;