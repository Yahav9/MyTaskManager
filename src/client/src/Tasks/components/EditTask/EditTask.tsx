import { FormEvent, useState } from 'react';
import './EditTask.scss';
import Button from '../../../shared/components/Button/Button';
import Card from '../../../shared/components/Card/Card';

interface EditTaskProps extends Omit<Task, 'name' | 'dueDate'> {
    name?: string;
    dueDate?: string;
    onCancel: () => void;
    onSubmit: (event: FormEvent, newTask: Task) => Promise<void>
}

export interface Task {
    name: string;
    priority?: string;
    responsibility?: string;
    estimatedTimeToComplete?: number;
    dueDate?: Date;
}

function EditTask(props: EditTaskProps) {
    const [name, setName] = useState(props.name || '');
    const [priority, setPriority] = useState(props.priority || 'none');
    const [responsibility, setResponsibility] = useState(props.responsibility || '');
    const [estimatedTimeToComplete, setEstimatedTimeToComplete] = useState(props.estimatedTimeToComplete || 0);
    const [dueDate, setDueDate] = useState(props.dueDate || '');

    const formSubmitHandler = (event: FormEvent) => {
        const newTask = {
            name,
            priority: priority === 'none' ? undefined : priority,
            responsibility: responsibility.length < 1 ? undefined : responsibility,
            estimatedTimeToComplete: estimatedTimeToComplete <= 0 ? undefined : estimatedTimeToComplete,
            dueDate: dueDate.length < 1 ? undefined : new Date(dueDate)
        };
        props.onSubmit(event, newTask);
    };

    return (
        <Card className="task-item edit-task">
            <form onSubmit={event => formSubmitHandler(event)}>
                <div className="inputs">
                    <div className="user-input name">
                        <label>Task: </label>
                        <input
                            maxLength={25}
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
                            defaultValue={priority || 'none'}
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
                            maxLength={17}
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
                            value={estimatedTimeToComplete}
                            onChange={
                                event => {
                                    setEstimatedTimeToComplete(Number((event.target as HTMLInputElement).value));
                                }
                            }
                        /> hrs
                    </div>
                    <div className="user-input">
                        <label>Due Date: </label>
                        <input
                            className="due-date"
                            type="Date"
                            min={new Date().toLocaleDateString('en-CA')}
                            value={dueDate ? new Date(dueDate).toLocaleDateString('en-CA') : ''}
                            onChange={event => {
                                setDueDate(
                                    new Date((event.target as HTMLInputElement).value).toLocaleDateString('en-CA')
                                );
                            }}
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
    );
}

export default EditTask;
