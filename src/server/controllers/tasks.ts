import { Request, Response } from 'express';
import { Types, startSession } from 'mongoose';
import { findExistingListById } from './lists';
import Task, { TaskDoc } from '../models/Task';
import { ListDoc } from '../models/List';

async function saveNewTaskOnDB(createdTask: TaskDoc, list: ListDoc): Promise<void> {
    try {
        const sess = await startSession();
        sess.startTransaction();
        await createdTask.save({ session: sess });
        list.tasks.push(createdTask);
        await list.save({ session: sess });
        await sess.commitTransaction();
    } catch (e) {
        console.log(e);
    }
}

async function removeTaskFromDB(task: TaskDoc) {
    try {
        const sess = await startSession();
        sess.startTransaction();
        await task.remove({ session: sess });
        task.list.tasks.pull(task);
        await task.list.save({ session: sess });
        await sess.commitTransaction();
    } catch (e) {
        console.log(e);
    }
}

async function findTaskById(taskId: Types.ObjectId) {
    try {
        const task = await Task.findById(taskId).populate('list');
        return task;
    } catch (e) {
        console.log(e);
    }
}

export async function createTask(req: Request, res: Response) {
    const newTask = req.body;
    const listId = new Types.ObjectId(req.params.listId);
    const list = await findExistingListById(listId);

    if (!list) {
        res.json({ message: 'Wrong list id' });
        return;
    } else if (list.user._id.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    const createdTask = new Task({
        name: newTask.name,
        priority: newTask.priority,
        dueDate: new Date(newTask.dueDate),
        responsibility: newTask.responsibility,
        estimatedTimeToCompleteInHours: newTask.estimatedTimeToCompleteInHours,
        done: false,
        list
    });

    try {
        await saveNewTaskOnDB(createdTask, list);
        res.json(createdTask);
    } catch (e) {
        res.json(e);
    }
}

export async function getTasks(req: Request, res: Response) {
    const listId = new Types.ObjectId(req.params.listId);
    const list = await (await findExistingListById(listId))?.populate<{ tasks: Types.Array<TaskDoc> }>('tasks');

    if (!list) {
        res.json({ message: 'wrong list id' });
        return;
    } else if (list.user._id.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    res.json({ listName: list.name, tasks: list.tasks });
}

export async function editTask(req: Request, res: Response) {
    const taskId = new Types.ObjectId(req.params.taskId);
    const updatedTask = req.body;
    const task = await findTaskById(taskId);

    if (!task) {
        res.json({ message: 'Wrong task id' });
        return;
    } else if (task.list.user.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    task.name = updatedTask.name;
    task.priority = updatedTask.priority;
    task.dueDate = new Date(updatedTask.dueDate);
    task.responsibility = updatedTask.responsibility;
    task.estimatedTimeToCompleteInHours = updatedTask.estimatedTimeToCompleteInHours;

    try {
        await task.save();
        res.json(task);
    } catch (e) {
        res.json(e);
    }
}

export async function updateTaskStatus(req: Request, res: Response) {
    const taskId = new Types.ObjectId(req.params.taskId);
    const task = await findTaskById(taskId);

    if (!task) {
        res.json({ message: 'wrong task id' });
        return;
    } else if (task.list.user.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    try {
        task.done = !task.done;
        await task.save();
        res.json({ done: task.done });
    } catch (e) {
        res.json(e);
    }
}

export async function deleteTask(req: Request, res: Response) {
    const taskId = new Types.ObjectId(req.params.taskId);
    const task = await findTaskById(taskId);

    if (!task) {
        res.json({ message: 'wrong task id' });
        return;
    } else if (task.list.user.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    try {
        await removeTaskFromDB(task);
        res.json({ deletedTaskId: task.id });
    } catch (e) {
        res.json(e);
    }
}
