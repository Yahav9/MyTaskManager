import React from "react";
import TaskCard from "./components/TaskCard";

function ListPage() {
    let tasks = ['do the laundry', 'wash the dishes', 'clean the house'];

    tasks = tasks.map(task => {
        return <TaskCard>{task}</TaskCard>
    });

    return (
        <div>
            <h2>
                {window.location.pathname.split('/')[2].replace(/%20/g, ' ')}
            </h2>
            {tasks}
            <button>CREATE NEW TASK</button>
        </div>
    )
}

export default ListPage;