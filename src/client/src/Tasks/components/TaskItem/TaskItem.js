import React, { useContext, useState } from "react";
import axios from "axios";

import './TaskItem.scss'
import Card from "../../../shared/components/Card/Card";
import Button from "../../../shared/components/Button/Button";
import EditTask from "../EditTask/EditTask";
import { AuthContext } from "../../../shared/context/AuthContext";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";

function TaskItem(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(props.name);
    const [priority, setPriority] = useState(props.priority || 'none');
    const [responsibility, setResponsibility] = useState(props.responsibility || '');
    const [etc, setEtc] = useState(props.etc || '');
    const [dueDate, setDueDate] = useState(props.dueDate || '');
    const [isDone, setIsDone] = useState(props.isDone);
    const [isUpdatingATask, setIsUpdatingATask] = useState(false);
    const auth = useContext(AuthContext);

    const updateTask = async (event, name, priority, responsibility, etc, dueDate) => {
        event.preventDefault();
        setIsUpdatingATask(false);
        let res;
        try {
            setIsLoading(true)
            res = await axios.put(`http://localhost:4000/api/tasks/${props.id}`, {
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
        const taskData = res.data;
        console.log(taskData)
        setName(taskData.name);
        setPriority(taskData.priority);
        setResponsibility(taskData.responsibility);
        setEtc(taskData.etc);
        setDueDate(taskData.dueDate);
    }

    const deleteHandler = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`http://localhost:4000/api/tasks/${props.id}`, {
                headers: { authorization: auth.token }
            });
            setIsLoading(false);
            props.onDelete(props.id);
        } catch (e) {
            setIsLoading(false);
            console.log(e)
        }
    }

    const changeTaskStatus = async () => {
        try {
            await axios.patch(`http://localhost:4000/api/tasks/${props.id}`, null, {
                headers: { authorization: auth.token }
            });
            setIsDone(!isDone);
        } catch (e) {
            console.log(e);
        }
    }

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
                    etc={etc}
                    dueDate={dueDate}
                />
            }
            {isLoading && <Card className="task-item"><LoadingSpinner asOverlay /></Card>}
            {
                !isUpdatingATask && !isLoading &&
                <Card className={`task-item hover-animation ${priority}`}>
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
                            <div className="responsibility">
                                <h3>Responsibility</h3>
                                <p>{responsibility}</p>
                            </div>
                        </>
                    }
                    {
                        etc > 0 &&
                        <>
                            <span />
                            <div className="etc">
                                <h3>ETC</h3>
                                <p>{etc + ' hrs'}</p>
                            </div>
                        </>
                    }
                    {
                        dueDate && dueDate !== 'Invalid Date' && dueDate.length > 0 &&
                        <>
                            <span />
                            <div className="due-date">
                                <h3>Due Date</h3>
                                <p>{new Date(Date.parse(dueDate)).toLocaleDateString("en-GB")}</p>
                            </div>
                        </>
                    }
                    <div className="buttons">
                        <span />
                        <Button onClick={() => setIsUpdatingATask(true)} inverse>
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
    )
}

export default TaskItem;