import React from "react";

function EditTask() {
    return (
        <form>
            <label>Task:</label>
            <input type="text" />
            <label>Priority:</label>
            <select>
                <option value="none" selected>None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <label>Due Date:</label>
            <input type="Date" />
            <label>Responsibility:</label>
            <input type="text" />
            <label> ETC(Estimated Time to Complete):</label>
            <input type="number" /> working hours
            <button>CREATE</button>
        </form>
    )
}

export default EditTask;