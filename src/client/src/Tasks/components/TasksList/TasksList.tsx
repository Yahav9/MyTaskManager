import { FormEvent, useContext, useState } from 'react';
import axios from 'axios';
import './TasksList.scss';
import Button from '../../../shared/components/Button/Button';
import Card from '../../../shared/components/Card/Card';
import EditTask, { Task } from '../EditTask/EditTask';
import TaskItem from '../TaskItem/TaskItem';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner';

interface TaskListProps {
    tasks: (
        Task & {
            _id: string;
            done: boolean
        }
    )[];
    listId: string;
    onTaskCreation: (newTask: Task) => void;
    onTaskDelete: (deletedTaskId: string) => void;
}

function TasksList(props: TaskListProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingATask, setIsCreatingATask] = useState(false);
    const auth = useContext(AuthContext);

    const createTask = async (event: FormEvent, newTask: Task) => {
        event.preventDefault();
        setIsCreatingATask(false);
        let res;
        try {
            setIsLoading(true);
            res = await axios.post(`https://my-task-manager-rh8y.onrender.com/api/tasks/${props.listId}`, newTask, {
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
                        dueDate={task.dueDate && task.dueDate.toLocaleDateString('en-GB')}
                        responsibility={task.responsibility}
                        estimatedTimeToComplete={task.estimatedTimeToComplete}
                        isDone={task.done}
                        onDelete={props.onTaskDelete}
                        abortTaskCreation={() => setIsCreatingATask(false)}
                    />;
                })
            }
        </ul>
    );
}

export default TasksList;
