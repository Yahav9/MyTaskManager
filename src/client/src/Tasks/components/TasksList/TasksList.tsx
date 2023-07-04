import { FormEvent, useContext, useState } from 'react';
import axios from 'axios';
import './TasksList.scss';
import Button from '../../../shared/components/Button/Button';
import Card from '../../../shared/components/Card/Card';
import EditTask, { Task } from '../EditTask/EditTask';
import TaskItem from '../TaskItem/TaskItem';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner';
import { SavedTask } from '../../TasksPage';

interface TaskListProps {
    tasks: SavedTask[];
    listId: string;
    onTaskCreation: (newTask: SavedTask) => void;
    onTaskDelete: (deletedTaskId: string) => void;
}

function TasksList(props: TaskListProps) {
    const { tasks, listId, onTaskCreation, onTaskDelete } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingATask, setIsCreatingATask] = useState(false);
    const [renderedTasks, setRenderedTasks] = useState(tasks);
    const auth = useContext(AuthContext);

    const createTask = async (event: FormEvent, newTask: Task) => {
        event.preventDefault();
        setIsCreatingATask(false);
        try {
            setIsLoading(true);
            const res = await axios.post(
                `https://my-task-manager-rh8y.onrender.com/api/tasks/${listId}`,
                newTask,
                { headers: { authorization: auth.token as string } }
            );
            onTaskCreation(res.data);
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    };

    const taskStatusChangeHandler = (taskId: string, isDone: boolean) => {
        const task = renderedTasks.find(({ _id }) => _id === taskId);
        if (isDone) {
            setRenderedTasks(prevTasks => [...prevTasks.filter(({ _id }) => _id !== taskId), task as SavedTask]);
            console.log(isDone);
        } else if (!isDone) {
            setRenderedTasks(prevTasks => [task as SavedTask, ...prevTasks.filter(({ _id }) => _id !== taskId)]);
            console.log(isDone);
        }
    };

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
                renderedTasks && renderedTasks.length < 1 &&
                <li>
                    <Card className="task-item">
                        <h2 className="no-tasks">No tasks found...</h2>
                    </Card>
                </li>
            }
            {
                renderedTasks && renderedTasks.length > 0 && renderedTasks.map(task => {
                    return <TaskItem
                        key={task._id}
                        id={task._id}
                        name={task.name}
                        priority={task.priority}
                        dueDate={task.dueDate}
                        responsibility={task.responsibility}
                        estimatedTimeToCompleteInHours={task.estimatedTimeToCompleteInHours}
                        isDone={task.done}
                        onDelete={onTaskDelete}
                        abortTaskCreation={() => setIsCreatingATask(false)}
                        onStatusChange={taskStatusChangeHandler}
                    />;
                })
            }
        </ul>
    );
}

export default TasksList;
