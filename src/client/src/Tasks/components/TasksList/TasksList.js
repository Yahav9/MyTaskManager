import React, { useContext, useState } from 'react';
import axios from 'axios';

import './TasksList.scss';
import Button from '../../../shared/components/Button/Button';
import Card from '../../../shared/components/Card/Card';
import EditTask from '../EditTask/EditTask';
import TaskItem from '../TaskItem/TaskItem';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner';

function TasksList(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingATask, setIsCreatingATask] = useState(false);
    const auth = useContext(AuthContext);

    const createTask = async (event, name, priority, responsibility, etc, dueDate) => {
        event.preventDefault();
        setIsCreatingATask(false);
        let res;
        try {
            setIsLoading(true);
            res = await axios.post(`https://my-awesome-task-manager.herokuapp.com/api/tasks/${props.listId}`, {
                name,
                priority,
                responsibility,
                etc,
                dueDate
            }, {
                headers: { authorization: auth.token }
            });
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }

        props.onTaskCreation(res.data);
    };

    const tasks = props.tasks;
    return (
        <ul className="tasks-list">
            {
                !isCreatingATask &&
                <Button
                    className="create-button"
                    onClick={() => setIsCreatingATask(true)}
                >
                    ADD NEW TASK
                </Button>
            }
            {isCreatingATask && <li><EditTask onSubmit={createTask} onCancel={() => setIsCreatingATask(false)} /></li>}
            {isLoading && <li><Card className="task-item"><LoadingSpinner asOverlay /></Card></li>}
            {
                tasks && tasks.length < 1 &&
                <li>
                    <Card className="task-item">
                        <h2 className="no-tasks">No tasks found...</h2>
                    </Card>
                </li>
            }
            {
                tasks && tasks.length > 0 && tasks.map(task => {
                    return <TaskItem
                        key={task._id}
                        id={task._id}
                        name={task.name}
                        priority={task.priority}
                        dueDate={task.dueDate}
                        responsibility={task.responsibility}
                        etc={task.etc}
                        isDone={task.done}
                        listId={props.listId}
                        onDelete={props.onTaskDelete}
                        abortTaskCreation={() => setIsCreatingATask(false)}
                    />;
                })
            }
        </ul>
    );
}

export default TasksList;
