import React, { useState } from "react";
import axios from "axios";

import Button from "../../../shared/components/Button/Button";
import Card from "../../../shared/components/Card/Card";
import EditTask from "../EditTask/EditTask";
import TaskItem from "../TaskItem/TaskItem";

function TasksList(props) {
    const [isCreatingATask, setIsCreatingATask] = useState(false);

    const createTask = async (event, name, priority, responsibility, etc, dueDate) => {
        event.preventDefault();
        const res = await axios.post(`http://localhost:4000/api/tasks/${props.listId}`, {
            name,
            ...priority && priority,
            ...responsibility && responsibility,
            ...etc && etc,
            ...dueDate && dueDate
        });
        props.onTaskCreation(res.data.newTask);
        setIsCreatingATask(false);
    }

    const tasks = props.tasks;
    return (
        <ul>
            {
                tasks.length < 1 &&
                <Card>
                    <h2>You don't have any pending tasks...</h2>
                </Card>
            }
            {
                tasks.length > 0 && tasks.map(task => {
                    return <TaskItem
                        key={task._id}
                        id={task._id}
                        name={task.name}
                        priority={task.priority}
                        dueDate={task.dueDate}
                        responsibility={task.responsibility}
                        etc={task.etc}
                        done={task.done}
                        listId={props.listId}
                    />
                })
            }
            <Card>
                {isCreatingATask && <EditTask onSubmit={createTask} />}
                {
                    !isCreatingATask &&
                    <Button
                        onClick={() => setIsCreatingATask(true)}
                    >
                        ADD NEW TASK
                    </Button>
                }
            </Card>
        </ul>
    )
}

export default TasksList;