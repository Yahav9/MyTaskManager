import React from "react";
import ListCard from "./ListCard";

function TaskLists() {
    let listNames = ['House Cleaning', 'Project Making', 'Interview Preperation']
    listNames = listNames.map(listName => {
        return <ListCard>{listName}</ListCard>
    })
    return (
        <ul>
            {listNames}
        </ul>
    )
}

export default TaskLists;