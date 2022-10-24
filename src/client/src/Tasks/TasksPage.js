import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import TasksList from "./components/TasksList/TasksList";

function TasksPage() {
    const [listName, setListName] = useState('');
    const [tasksData, setTasksData] = useState([]);

    const listId = useParams().listId

    useEffect(() => {
        (async () => {
            const res = await axios.get(`http://localhost:4000/api/tasks/${listId}`);
            console.log(res.data);
            setListName(res.data.list.name);
            setTasksData(res.data.tasks);
        })();
    }, [listId]);

    const addNewTask = newTask => {
        setTasksData(tasksData.push(newTask));
        console.log(tasksData)
    }

    return (
        <div>
            <h1>{listName}</h1>
            <TasksList
                tasks={tasksData}
                listId={listId}
                onTaskCreation={addNewTask}
            />
        </div>
    )
}

export default TasksPage;