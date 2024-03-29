import { FormEvent, useContext, useState } from 'react';
import axios from 'axios';
import './TaskItem.scss';
import Card from '../../../shared/components/Card/Card';
import Button from '../../../shared/components/Button/Button';
import EditTask, { Task } from '../EditTask/EditTask';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner';

interface TaskItemProps extends Task {
    id: string;
    isDone: boolean;
    onDelete: (deletedTaskId: string) => void;
    abortTaskCreation: () => void;
    onStatusChange: (taskId: string, isDone: boolean) => void;
}

function TaskItem(props: TaskItemProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(props.name);
    const [priority, setPriority] = useState(props.priority || 'none');
    const [responsibility, setResponsibility] = useState(props.responsibility || '');
    const [estimatedTimeToCompleteInHours, setEstimatedTimeToCompleteInHours] =
        useState(props.estimatedTimeToCompleteInHours || '');
    const [dueDate, setDueDate] = useState(props.dueDate || null);
    const [isDone, setIsDone] = useState(props.isDone);
    const [isUpdatingATask, setIsUpdatingATask] = useState(false);
    const auth = useContext(AuthContext);

    const updateTask = async (event: FormEvent, updatedTask: Task) => {
        event.preventDefault();
        setIsUpdatingATask(false);
        try {
            setIsLoading(true);
            const res = await axios.put(
                `https://my-task-manager-rh8y.onrender.com/api/tasks/${props.id}`,
                updatedTask,
                { headers: { authorization: auth.token as string } });
            const taskData = res.data;
            setName(taskData.name);
            setPriority(taskData.priority);
            setResponsibility(taskData.responsibility);
            setEstimatedTimeToCompleteInHours(taskData.estimatedTimeToCompleteInHours);
            setDueDate(taskData.dueDate);
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    };

    const deleteHandler = async () => {
        props.abortTaskCreation();
        try {
            setIsLoading(true);
            await axios.delete(`https://my-task-manager-rh8y.onrender.com/api/tasks/${props.id}`, {
                headers: { authorization: auth.token as string }
            });
            setIsLoading(false);
            props.onDelete(props.id);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    };

    const changeTaskStatus = async () => {
        props.abortTaskCreation();
        try {
            await axios.patch(`https://my-task-manager-rh8y.onrender.com/api/tasks/${props.id}`, null, {
                headers: { authorization: auth.token as string }
            });
            setIsDone(!isDone);
            props.onStatusChange(props.id, !isDone);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <li>
            {
                isUpdatingATask &&
                <EditTask
                    onSubmit={updateTask}
                    onCancel={() => setIsUpdatingATask(false)}
                    name={name}
                    priority={priority}
                    responsibility={responsibility}
                    estimatedTimeToCompleteInHours={Number(estimatedTimeToCompleteInHours)}
                    dueDate={dueDate || undefined}
                />
            }
            {isLoading && <Card className="task-item"><LoadingSpinner asOverlay /></Card>}
            {
                !isUpdatingATask && !isLoading &&
                <Card className={`task-item ${priority}`}>
                    <div className="task-details">
                        <div className="name">
                            <i className="material-icons" onClick={changeTaskStatus}>
                                {isDone ? 'check_box' : 'check_box_outline_blank'}
                            </i>
                            <h2 className={isDone ? 'done' : ''}>{name}</h2>
                        </div>
                        {
                            responsibility && responsibility.length > 0 &&
                            <>
                                <span />
                                <div className="details responsibility">
                                    <h3>Responsibility</h3>
                                    <p>{responsibility}</p>
                                </div>
                            </>
                        }
                        {
                            Number(estimatedTimeToCompleteInHours) > 0 &&
                            <>
                                <span />
                                <div className="details etc">
                                    <h3>ETC</h3>
                                    <p>{estimatedTimeToCompleteInHours + ' hrs'}</p>
                                </div>
                            </>
                        }
                        {
                            dueDate &&
                            <>
                                <span />
                                <div className="details due-date">
                                    <h3>Due Date</h3>
                                    <p>{new Date(dueDate).toLocaleDateString('en-GB')}</p>
                                </div>
                            </>
                        }
                    </div>
                    <span className="buttons-span" />
                    <div className="buttons">
                        <Button
                            inverse
                            onClick={() => {
                                setIsUpdatingATask(true);
                                props.abortTaskCreation();
                            }}
                        >
                            <i
                                className="material-icons"
                            >
                                edit
                            </i>
                        </Button>
                        <Button onClick={deleteHandler} danger>
                            <i className="material-icons"
                            >
                                delete
                            </i>
                        </Button>
                    </div>
                </Card>
            }
        </li>
    );
}

export default TaskItem;
