import React from "react";
import TaskCard from "./components/TaskCard";

function ListPage() {
    let tasks = ['do the laundry', 'wash the dishes', 'clean the house'];

    tasks = tasks.map(task => {
        return <TaskCard key={task}>{task}</TaskCard>
    });

    return (
        <div>
            <h2>
                {window.location.pathname.split('/')[2].replace(/%20/g, ' ')}
            </h2>
            {tasks}
            <button
                onClick={() => {
                    window.open(
                        window.location.href + "/edit-task",
                        "_blank",
                        "height=300,width=500,top=250,left=500"
                    )
                }}
            >
                CREATE NEW TASK
            </button>
        </div>
    )
}

export default ListPage;