import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import List from '../models/List';

export async function getTasks(req: Request, res: Response) {
    const listId = new mongoose.Types.ObjectId(req.params.listId);

    let list;
    try {
        list = await List.findById(listId).populate('tasks');
    } catch (e) {
        return res.json({ error: e });
    }

    if (!list) {
        return res.json({ message: 'wrong list id' });
    }

    // @ts-ignore
    if (list.user._id.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    return res.json(list.tasks);
}

export async function createTask(req: Request, res: Response) {
    let { name, priority, dueDate, responsibility, etc } = req.body;

    priority === 'none' && (priority = undefined);
    dueDate && dueDate.length < 1 && (dueDate = undefined);
    responsibility && responsibility.length < 1 && (responsibility = undefined);
    etc <= 0 && (etc = undefined);

    const listId = new mongoose.Types.ObjectId(req.params.listId);
    let list;
    try {
        list = await List.findById(listId);
    } catch (e) {
        return res.json({ error: e });
    }
    if (!list) {
        return res.json({ message: 'Wrong list id' });
    }

    // @ts-ignore
    if (list.user._id.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    const createdTask = new Task({
        name,
        priority,
        dueDate,
        responsibility,
        etc,
        done: false,
        list
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTask.save({ session: sess });
        // @ts-ignore
        list.tasks.push(createdTask);
        await list.save({ session: sess });
        await sess.commitTransaction();
        return res.json({
            _id: createdTask._id,
            name,
            priority,
            dueDate,
            responsibility,
            etc,
            done: false,
        });
    } catch (e) {
        console.log(e);
        return res.json({ secondError: e });
    }
}

export async function editTask(req: Request, res: Response) {
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);
    let { name, priority, dueDate, responsibility, etc } = req.body;

    priority === 'none' && (priority = undefined);
    dueDate.length < 1 && (dueDate = undefined);
    responsibility.length < 1 && (responsibility = undefined);
    etc <= 0 && (etc = undefined);

    let task;
    try {
        task = await Task.findById(taskId).populate('list');
    } catch (e) {
        return res.json({ error: e });
    }

    if (!task) {
        return res.json({ message: 'Wrong task id' });
    }

    // @ts-ignore
    if (task.list.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    task.name = name;
    task.priority = undefined;
    task.dueDate = undefined;
    task.responsibility = undefined;
    task.etc = undefined;

    priority !== 'none' && (task.priority = priority);
    dueDate && dueDate.length > 0 && (task.dueDate = dueDate);
    responsibility && responsibility.length > 0 && (task.responsibility = responsibility);
    etc > 0 && (task.etc = etc);
    try {
        await task.save();
        return res.json(task);
    } catch (e) {
        res.json({ error: e });
    }
}

export async function updateTaskStatus(req: Request, res: Response) {
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);
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
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await task.remove({ session: sess });
        // @ts-ignore
        task.list.tasks.pull(task);
        // @ts-ignore
        await task.list.save({ session: sess });
        await sess.commitTransaction();
        return res.json({ deletedTask: task, list: task.list });
    } catch (e) {
        return res.json({ error: e });
    }
}
