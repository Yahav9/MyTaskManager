import React, { useState } from "react";

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
            <button
                onClick={clearHandler}
            >
                CLEAR
            </button>
        </div>
    )
}

export default Searchbar;