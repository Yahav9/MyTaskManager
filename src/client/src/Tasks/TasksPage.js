import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import './TasksPage.scss'
import TasksList from "./components/TasksList/TasksList";
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner'
import { AuthContext } from "../shared/context/AuthContext";

function TasksPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [listName, setListName] = useState('');
    const [tasksData, setTasksData] = useState([]);
    const auth = useContext(AuthContext);

    const listId = useParams().listId;

    useEffect(() => {
        (async () => {
            let res;
            try {
                setIsLoading(true);
                res = await axios.get(`https://my-awesome-task-manager.herokuapp.com/api/tasks/${listId}`, {
                    headers: { authorization: auth.token }
                });
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
            setListName(res.data.list.name);
            setTasksData(res.data.tasks.sort((a, b) => { return a.done - b.done }));
        })();
    }, [auth.token, listId]);

    const addNewTask = newTask => {
        setTasksData(tasks => [newTask, ...tasks]);
    }

    const deleteTask = deletedTaskId => {
        setTasksData(tasksData.filter(task => task._id !== deletedTaskId));
    }

    return (
        <div className="tasks-page">
            {isLoading && <LoadingSpinner asOverlay />}
            {
                !isLoading &&
                <>
                    <h1>{listName}</h1>
                    <TasksList
                        tasks={tasksData}
                        listId={listId}
                        onTaskCreation={addNewTask}
                        onTaskDelete={deleteTask}
                    />
                </>
            }
        </div>
    )
}

export default TasksPage;