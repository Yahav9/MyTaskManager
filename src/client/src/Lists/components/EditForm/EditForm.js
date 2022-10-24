import React, { useState } from "react";

import Button from "../../../shared/components/Button/Button";

function EditForm(props) {
    const [value, setValue] = useState(props.value || '');

    return (
        <div>
            <input
                type="text"
                value={value}
                autoFocus
                onChange={event => setValue(event.target.value)}
            />
            <Button
                onClick={() => props.onSave(value)}
                disabled={value.length < 1}
            >
                SAVE
            </Button>
        </div>
    )
}

export default EditForm;