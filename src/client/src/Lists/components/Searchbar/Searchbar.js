import React, { useState } from "react";

import Button from "../../../shared/components/Button/Button";

function Searchbar(props) {
    const [value, setValue] = useState('');

    const changeHandler = event => {
        setValue(event.target.value)
        props.onChange(event);
    }

    const clearHandler = () => {
        setValue('');
        props.onClear();
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search a List..."
                value={value}
                onChange={changeHandler}
            />
            <Button
                onClick={clearHandler}
                disabled={value < 1}
                inverse
            >
                CLEAR
            </Button>
        </div>
    )
}

export default Searchbar;