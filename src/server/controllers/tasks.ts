import { Request, Response } from 'express';
import { Types, startSession } from 'mongoose';
import { ListDoc, TaskDoc, findExistingListById } from './lists';
import Task from '../models/Task';

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

async function findTaskById(taskId: Types.ObjectId) {
    let task;
    try {
        task = await Task.findById(taskId).populate('list');
    } catch (e) {
        return console.log(e);
    }
    return task;
}

export async function createTask(req: Request, res: Response) {
    const newTask = req.body;
    const listId = new Types.ObjectId(req.params.listId);
    const list = await findExistingListById(listId);

    if (!list) {
        return res.json({ message: 'Wrong list id' });
    } else if (list.user._id.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    const createdTask = new Task({
        name: newTask.name,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        responsibility: newTask.responsibility,
        estimatedTimeToCompleteInHours: newTask.estimatedTimeToCompleteInHours,
        done: false,
        list
    });

    try {
        await saveNewTaskOnDB(createdTask, list);
        return res.json(createdTask);
    } catch (e) {
        console.log(e);
    }
}

export async function getTasks(req: Request, res: Response) {
    const listId = new Types.ObjectId(req.params.listId);
    const list = await (await findExistingListById(listId))?.populate<{ tasks: Types.Array<TaskDoc> }>('tasks');

    if (!list) {
        return res.json({ message: 'wrong list id' });
    } else if (list.user._id.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    return res.json(list.tasks);
}

export async function editTask(req: Request, res: Response) {
    const taskId = new Types.ObjectId(req.params.taskId);
    const updatedTask = req.body;
    const task = await findTaskById(taskId);

    if (!task) {
        return res.json({ message: 'Wrong task id' });
    } else if (task.list.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    task.name = updatedTask.name;
    task.priority = updatedTask.priority;
    task.dueDate = updatedTask.dueDate;
    task.responsibility = updatedTask.responsibility;
    task.estimatedTimeToCompleteInHours = updatedTask.estimatedTimeToCompleteInHours;

    try {
        await task.save();
        return res.json(task);
    } catch (e) {
        res.json({ error: e });
    }
}

export async function updateTaskStatus(req: Request, res: Response) {
    const taskId = new Types.ObjectId(req.params.taskId);
    let task;
    try {
        task = await Task.findById(taskId).populate('list');
    } catch (e) {
        return res.json({ error: e });
    }

    if (!task) {
        return res.json({ message: 'wrong task id' });
    }

    // @ts-ignore
    if (task.list.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    task.done = !task.done;

    try {
        await task.save();
        return res.json({ done: task.done });
    } catch (e) {
        res.json({ error: e });
    }
}

export async function deleteTask(req: Request, res: Response) {
    const taskId = req.params.taskId;

    let task;
    try {
        task = await Task.findById(taskId).populate('list');
    } catch (e) {
        return res.json({ error: e });
    }

    if (!task) {
        return res.json({ message: 'wrong task id' });
    }

    // @ts-ignore
    if (task.list.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    try {
        const sess = await startSession();
        sess.startTransaction();
        await task.remove({ session: sess });
        // @ts-ignore
        task.list.tasks.pull(task);
        // @ts-ignore
        await task.list.save({ session: sess });
        await sess.commitTransaction();
        return res.json({ deletedTaskId: task.id });
    } catch (e) {
        return res.json({ error: e });
    }
}
