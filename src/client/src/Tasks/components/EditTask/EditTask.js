import React, { useState } from "react";

import Button from "../../../shared/components/Button/Button";

function EditTask(props) {
    const [name, setName] = useState(props.name || '');
    const [priority, setPriority] = useState(props.priority || 'none');
    const [responsibility, setResponsibility] = useState(props.responsibility || '');
    const [etc, setEtc] = useState(props.etc || 0);
    const [dueDate, setDueDate] = useState(props.dueDate || '');

    return (
        <form onSubmit={event => props.onSubmit(event, name, priority, responsibility, etc, new Date(Date.parse(dueDate)).toLocaleDateString("en-GB"))}>
            <label>Task: </label>
            <input
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
            />
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
            <label>Responsibility: </label>
            <input
                type="text"
                value={responsibility}
                onChange={event => setResponsibility(event.target.value)}
            />
            <label> ETC(Estimated Time to Complete): </label>
            <input
                type="number"
                min="0"
                max="200"
                step="0.5"
                value={etc}
                onChange={event => setEtc(event.target.value)}
            /> working hours
            <label>Due Date: </label>
            <input
                type="Date"
                min={new Date().toLocaleDateString('en-CA')}
                pattern="\d{4}-\d{2}-\d{2}"
                value={dueDate}
                onChange={event => setDueDate(event.target.value)}
            />
            <Button
                type="submit"
                disabled={!name || name.length < 1}
            >
                SAVE
            </Button>
        </form>
    )
}

export default EditTask;
