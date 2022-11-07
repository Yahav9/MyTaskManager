import React, { useState } from "react";

import './EditTask.scss'
import Button from "../../../shared/components/Button/Button";
import Card from "../../../shared/components/Card/Card";

function EditTask(props) {
    const [name, setName] = useState(props.name || '');
    const [priority, setPriority] = useState(props.priority || 'none');
    const [responsibility, setResponsibility] = useState(props.responsibility || '');
    const [etc, setEtc] = useState(props.etc || 0);
    const [dueDate, setDueDate] = useState(props.dueDate || '');

    return (
        <Card className="edit-task">
            <form onSubmit={event => props.onSubmit(event, name, priority, responsibility, etc, dueDate)}>
                <div className="inputs">
                    <div className="user-input name">
                        <label>Task: </label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>
                    <div className="user-input priority">
                        <label>Priority: </label>
                        <select
                            defaultValue={priority || "none"}
                            onChange={event => setPriority(event.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="user-input responsibility">
                        <label>Responsibility: </label>
                        <input
                            type="text"
                            value={responsibility}
                            onChange={event => setResponsibility(event.target.value)}
                        />
                    </div>
                    <div className="user-input etc">
                        <label> ETC (Estimated Time to Complete): </label>
                        <input
                            type="number"
                            min="0"
                            max="200"
                            step="0.5"
                            value={etc}
                            onChange={event => setEtc(event.target.value)}
                        /> hrs
                    </div>
                    <div className="user-input due-date">
                        <label>Due Date: </label>
                        <input
                            type="Date"
                            min={new Date().toLocaleDateString('en-CA')}
                            value={dueDate}
                            onChange={event => { setDueDate(event.target.value) }}
                        />
                    </div>
                </div>
                <div className="buttons">
                    <Button
                        className="edit-button"
                        type="submit"
                        disabled={!name || name.length < 1}
                    >
                        SAVE
                    </Button>
                    <Button
                        className="edit-button"
                        type="button"
                        onClick={props.onCancel}
                        inverse
                    >
                        CANCEL
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default EditTask;
