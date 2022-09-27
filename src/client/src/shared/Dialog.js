import React, { useState } from "react";

function Dialog(props) {
    const [isVisible, setIsVisible] = useState(false);

    const closeDialog = () => setIsVisible(false);

    if (isVisible === true) {
        return (
            <div>
                {props.message}
                <button onClick={closeDialog}>Yes</button>
                <button onClick={closeDialog}>No</button>
            </div>
        )
    }
}

export default Dialog;