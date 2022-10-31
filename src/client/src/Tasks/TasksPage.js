import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import TasksList from "./components/TasksList/TasksList";
import { AuthContext } from "../shared/context/AuthContext";

function TasksPage() {
    const [listName, setListName] = useState('');
    const [tasksData, setTasksData] = useState([]);
    const auth = useContext(AuthContext);

    const listId = useParams().listId;

    useEffect(() => {
        (async () => {
            const res = await axios.get(`http://localhost:4000/api/tasks/${listId}`, {
                headers: { authorization: auth.token }
            });
            console.log(res.data);
            setListName(res.data.list.name);
            setTasksData(res.data.tasks);
        })();
    }, [auth.token, listId]);

    const addNewTask = newTask => {
        setTasksData(tasksData.push(newTask));
        console.log(tasksData)
    }

    const deleteTask = deletedTaskId => {
        setTasksData(tasksData.filter(task => task._id !== deletedTaskId));
    }

    return (
        <div>
            <h1>{listName}</h1>
            <TasksList
                tasks={tasksData}
                listId={listId}
                onTaskCreation={addNewTask}
                onTaskDelete={deleteTask}
            />
        </div>
    )
}

export default TasksPage;