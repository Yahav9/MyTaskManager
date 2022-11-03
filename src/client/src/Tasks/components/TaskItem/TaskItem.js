import React, { useContext, useState } from "react";
import axios from "axios";

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
            <Card>
                {
                    isUpdatingATask &&
                    <EditTask
                        onSubmit={updateTask}
                        name={name}
                        priority={priority}
                        responsibility={responsibility}
                        etc={etc}
                        dueDate={dueDate}
                    />
                }
                {isLoading && <LoadingSpinner asOverlay />}
                {
                    !isUpdatingATask && !isLoading &&
                    <>
                        <div>
                            <i className="material-icons" onClick={changeTaskStatus}>
                                check_box{+ !isDone && '_outline_blank'}
                            </i>
                            <h2>{name}</h2>
                        </div>
                        {
                            responsibility && responsibility.length > 0 &&
                            <div>
                                <h3>Responsibility</h3>
                                <p>{responsibility}</p>
                            </div>
                        }
                        {
                            etc > 0 &&
                            <div>
                                <h3>ETC</h3>
                                <p>{etc}</p>
                            </div>
                        }
                        {
                            dueDate && dueDate !== 'Invalid Date' && dueDate.length > 0 &&
                            <div>
                                <h3>Due Date</h3>
                                <p>{new Date(Date.parse(dueDate)).toLocaleDateString("en-GB")}</p>
                            </div>
                        }
                        <div>
                            <Button onClick={deleteHandler}>
                                <i className="material-icons"
                                >
                                    delete
                                </i>
                            </Button>
                            <Button onClick={() => setIsUpdatingATask(true)}>
                                <i
                                    className="material-icons"
                                >
                                    edit
                                </i>
                            </Button>
                        </div>
                    </>
                }
            </Card>
        </li>
    )
}

export default TaskItem;