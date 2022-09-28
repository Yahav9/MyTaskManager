import React from "react";

function Dialog(props) {

    if (props.show === true) {
        return (
            <div>
                {props.message}
                <button onClick={props.onDialogDeny}>Yes</button>
                <button onClick={props.onDialogDeny}>No</button>
            </div>
        )
    }
}

export default Dialog;