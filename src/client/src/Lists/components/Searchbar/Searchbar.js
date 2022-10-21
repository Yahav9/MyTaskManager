import React from "react";

function Searchbar(props) {
    return (
        <div>
            <input
                type="text"
                placeholder="Search a List..."
                onChange={props.onChange}
            />
            <button

            >
                CLEAR
            </button>
        </div>
    )
}

export default Searchbar;