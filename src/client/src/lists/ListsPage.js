import React, { useState } from "react";
import Dialog from "../shared/Dialog";
import Searchbar from "./components/Searchbar";
import TaskLists from "./components/TaskLists";

function ListsPage() {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const onListDelete = () => setShowConfirmDialog(true);
    const onDialogDeny = () => setShowConfirmDialog(false);

    return (
        <div>
            <h1>My Lists</h1>
            <Searchbar />
            <TaskLists onListDelete={onListDelete} />
            <Dialog
                message="Are you sure you want to delete this list?"
                show={showConfirmDialog}
                onDialogDeny={onDialogDeny}
            />
        </div>
    )
}

export default ListsPage;