import React from "react";
import ListCard from "./ListCard";

function TaskLists(props) {
    let listNames = ['House Cleaning', 'Project Making', 'Interview Preperation']

    listNames = listNames.map(listName => {
        return (
            <ListCard
                onDelete={props.onListDelete}
                key={listName}
            >
                {listName}
            </ListCard>
        )
    });

    return (
        <ul>
            {listNames}
            <button>CREATE NEW LIST</button>
        </ul>
    )
}

export default TaskLists;