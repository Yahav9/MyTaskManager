import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import List from '../models/List';

export async function getTasks(req: Request, res: Response) {
    const list = new mongoose.Types.ObjectId(req.params.listId);
    try {
        const tasks = await Task.find({ list: list });
        return res.json(tasks);
    } catch (e) {
        return res.json({ error: e });
    }
}

export async function createTask(req: Request, res: Response) {
    const { name, priority, dueDate, responsibility, etc } = req.body;
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

    const createdTask = new Task({
        name,
        priority,
        dueDate,
        responsibility,
        etc,
        done: false,
        list: list
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTask.save({ session: sess });
        // @ts-ignore
        list.tasks.push(createdTask);
        await list.save({ session: sess });
        await sess.commitTransaction();
        return res.json({ newTask: createdTask, list: list })
    } catch (e) {
        return res.json({ error: e });
    }
}

export async function editTask(req: Request, res: Response) {
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);
    const { name, priority, dueDate, responsibility, etc } = req.body;

    let task;
    try {
        task = await Task.findById(taskId);
    } catch (e) {
        return res.json({ error: e });
    }
    if (!task) {
        return res.json({ message: 'Wrong task id' })
    }

    task.name = name;
    task.priority = priority;
    task.dueDate = dueDate;
    task.responsibility = responsibility;
    task.etc = etc;
    try {
        await task.save();
        return res.json(task);
    } catch (e) {
        res.json({ error: e });
    }
}

export async function updateTaskState(req: Request, res: Response) {
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);
    let task;
    try {
        task = await Task.findById(taskId);
    } catch (e) {
        return res.json({ error: e });
    }

    if (!task) {
        return res.json({ message: 'wrong task id' });
    }

    if (task.done === true) {
        task.done = false;
    } else {
        task.done = true;
    }

    try {
        await task.save();
        return res.json(task);
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

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await task.remove({ session: sess });
        // @ts-ignore
        task.list.tasks.pull(task);
        // @ts-ignore
        await task.list.save({ session: sess });
        await sess.commitTransaction();
        return res.json({ deletedTask: task, list: task.list })
    } catch (e) {
        return res.json({ error: e });
    }
}