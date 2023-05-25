import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TasksPage.scss';
import TasksList from './components/TasksList/TasksList';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';
import { AuthContext } from '../shared/context/AuthContext';
import { Task } from './components/EditTask/EditTask';

export type SavedTask = Task & {
    _id: string;
    done: boolean
}

function TasksPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [listName, setListName] = useState('');
    const [tasksData, setTasksData] = useState<SavedTask[]>([]);
    const auth = useContext(AuthContext);
    const listId = useParams().listId as string;

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    `https://my-task-manager-rh8y.onrender.com/api/tasks/${listId}`,
                    { headers: { authorization: auth.token as string } }
                );
                setListName(res.data.listName);
                setTasksData(res.data.tasks.sort((a: SavedTask, b: SavedTask) => {
                    return Number(a.done) - Number(b.done);
                }));
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        })();
    }, [auth.token, listId]);

    const addNewTask = (newTask: SavedTask) => {
        setTasksData(tasks => [newTask, ...tasks]);
    };

    const deleteTask = (deletedTaskId: string) => {
        setTasksData(tasksData.filter(task => task._id !== deletedTaskId));
    };

    return (
        <div className="tasks-page">
            {isLoading && <LoadingSpinner asOverlay />}
            {
                !isLoading &&
                <>
                    <h1>{listName}</h1>
                    <TasksList
                        tasks={tasksData}
                        listId={listId}
                        onTaskCreation={addNewTask}
                        onTaskDelete={deleteTask}
                    />
                </>
            }
        </div>
    );
}

export default TasksPage;
