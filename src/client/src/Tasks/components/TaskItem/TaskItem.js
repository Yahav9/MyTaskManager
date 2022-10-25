import React, { useState } from "react";
import axios from "axios";

import Card from "../../../shared/components/Card/Card";
import Button from "../../../shared/components/Button/Button";
import EditTask from "../EditTask/EditTask";

function TaskItem(props) {
    const [name, setName] = useState(props.name);
    const [priority, setPriority] = useState(props.priority || 'none');
    const [responsibility, setResponsibility] = useState(props.responsibility || '');
    const [etc, setEtc] = useState(props.etc || '');
    const [dueDate, setDueDate] = useState(props.dueDate || '');
    // const [isDone, setIsDone] = useState(props.isDone);
    const [isUpdatingATask, setIsUpdatingATask] = useState(false);

    const updateTask = async (event, name, priority, responsibility, etc, dueDate) => {
        event.preventDefault();
        const res = await axios.put(`http://localhost:4000/api/tasks/${props.id}`, {
            name,
            priority,
            responsibility,
            etc,
            dueDate
        });
        const taskData = res.data;
        console.log(taskData)
        setName(taskData.name);
        setPriority(taskData.priority);
        setResponsibility(taskData.responsibility);
        setEtc(taskData.etc);
        setDueDate(taskData.dueDate);

        setIsUpdatingATask(false);
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
                {
                    !isUpdatingATask &&
                    <>
                        <div>
                            <i className="material-icons">check_box_outline_blank</i>
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
                            dueDate && dueDate.length > 0 &&
                            <div>
                                <h3>Due Date</h3>
                                <p>{dueDate}</p>
                            </div>
                        }
                        <div>
                            <Button>
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