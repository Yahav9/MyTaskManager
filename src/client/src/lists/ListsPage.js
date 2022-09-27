import React from "react";
import Dialog from "../shared/Dialog";
import Searchbar from "./components/Searchbar";
import TaskLists from "./components/TaskLists";

function ListsPage() {
    return (
        <div>
            <h1>My Lists</h1>
            <Searchbar />
            <TaskLists />
            <Dialog message="Are you sure you want to delete this list?" />
        </div>
    )
}

export default ListsPage;