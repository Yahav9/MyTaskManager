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
        <Card className="task-item edit-task">
            <form onSubmit={event => props.onSubmit(event, name, priority, responsibility, etc, dueDate)}>
                <div className="inputs">
                    <div className="user-input name">
                        <label>Task: </label>
                        <input
                            maxLength="25"
                            autoFocus
                            type="text"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>
                    <span />
                    <div className="user-input">
                        <label>Priority: </label>
                        <select
                            className="priority"
                            defaultValue={priority || "none"}
                            onChange={event => setPriority(event.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="user-input">
                        <label>Responsibility: </label>
                        <input
                            className="responsibility"
                            maxLength="17"
                            type="text"
                            value={responsibility}
                            onChange={event => setResponsibility(event.target.value)}
                        />
                    </div>
                    <div className="user-input">
                        <label> ETC (Estimated Time to Complete): </label>
                        <input
                            className="etc"
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={etc}
                            onChange={event => setEtc(event.target.value)}
                        /> hrs
                    </div>
                    <div className="user-input">
                        <label>Due Date: </label>
                        <input
                            className="due-date"
                            type="Date"
                            min={new Date().toLocaleDateString('en-CA')}
                            value={dueDate}
                            onChange={event => { setDueDate(event.target.value) }}
                        />
                    </div>
                </div>
                <div className="edit-buttons">
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
