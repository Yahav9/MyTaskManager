import { Request, Response } from 'express';
import mongoose from 'mongoose';
import List from '../models/List';
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
    }

    const createdList = new List({
        name,
        user: userId,
        tasks: []
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdList.save({ session: sess });
        existingUser.lists.push(createdList._id);
        await existingUser.save({ session: sess });
        await sess.commitTransaction();
    } catch (e) {
        return res.json({ error: e });
    }
    res.json({ newList: createdList, user: existingUser })
}

export async function getLists(req: Request, res: Response) {
    try {
        const lists = await List.find({ user: new mongoose.Types.ObjectId(req.params.userId) });
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

    list.name = newName;
    try {
        await list.save();
        return res.json({ list });
    } catch (e) {
        return res.json({ error: e });
    }
}