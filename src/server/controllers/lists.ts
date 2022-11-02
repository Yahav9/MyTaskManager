import { Request, Response } from 'express';
import mongoose from 'mongoose';
import List from '../models/List';
import Task from '../models/Task';
import User from '../models/User';

export async function createList(req: Request, res: Response) {
    const name = req.body.name;
    const userId = req.params.userId;
    let existingList: any;
    let existingUser: any;
    try {
        existingList = await List.findOne({ name: name, user: userId });
        existingUser = await User.findById(userId);
    } catch (e) {
        return res.json({ error: e });
    }
    if (existingList) {
        return res.json({ message: 'List name already exist' });
    } else if (!existingUser) {
        return res.json({ message: 'User does not exist' });
        //@ts-ignore
    } else if (userId !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    const createdList = new List({
        name,
        user: existingUser,
        tasks: []
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdList.save({ session: sess });
        existingUser.lists.push(createdList);
        await existingUser.save({ session: sess });
        await sess.commitTransaction();
        return res.json({
            _id: createdList._id,
            name,
            user: existingUser._id
        })
    } catch (e) {
        return res.json({ error: e });
    }
}

export async function getLists(req: Request, res: Response) {
    // @ts-ignore
    if (req.params.userId !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    const userId = new mongoose.Types.ObjectId(req.params.userId);
    try {
        const lists = await List.find({ user: userId });
        return res.json(lists);
    } catch (e) {
        return res.json({ message: 'Wrong user id' });
    }
}

export async function changeListName(req: Request, res: Response) {
    const newName = req.body.name;

    let existingListName;
    try {
        existingListName = await List.findOne({ name: newName });
    } catch (e) {
        return res.json({ error: e });
    }

    if (existingListName) {
        return res.json({ message: 'List name already exist' });
    }

    let list;
    try {
        list = await List.findById(new mongoose.Types.ObjectId(req.params.listId));
    } catch (e) {
        return res.json({ error: e });
    }
    if (!list) {
        return res.json({ message: 'wrong list id' });
    }

    // @ts-ignore
    if (list.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    list.name = newName;
    try {
        await list.save();
        return res.json({ list });
    } catch (e) {
        return res.json({ error: e });
    }
}

export async function deleteList(req: Request, res: Response) {
    const listId = new mongoose.Types.ObjectId(req.params.listId);

    let list;
    try {
        list = await List.findById(listId)
            .populate('user');
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

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await list.remove({ session: sess });
        // @ts-ignore
        list.user.lists.pull(list);
        // @ts-ignore
        await list.user.save({ session: sess });
        await Task.deleteMany({ list: listId });
        await sess.commitTransaction();
        return res.json({ deletedList: list, user: list.user, tasks: list.tasks });
    } catch (e) {
        return res.json({ error: e });
    }
}