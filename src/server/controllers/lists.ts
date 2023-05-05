import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import List, { IList } from '../models/List';
import Task from '../models/Task';
import User, { IUser } from '../models/User';

type TUser = Document<unknown, unknown, IUser> & IUser & { _id: mongoose.Types.ObjectId }
type TList = Document<unknown, unknown, IList> & IList & { _id: mongoose.Types.ObjectId; }

async function findExistingList(name: string, userId: string) {
    let existingList;
    try {
        existingList = await List.findOne({ name: name, user: userId });
    } catch (e) {
        return console.log(e);
    }
    return existingList;
}

async function findExistingUserById(userId: string) {
    let existingUser;
    try {
        existingUser = await User.findById(userId);
    } catch (e) {
        return console.log(e);
    }
    return existingUser;
}

async function saveNewList(createdList: TList, user: TUser): Promise<void> {
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdList.save({ session: sess });
        user.lists.push(createdList.id);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (e) {
        return console.log(e);
    }
}

export async function createList(req: Request, res: Response) {
    const name = req.body.name as string;
    const userId = req.params.userId as string;
    const existingList = await findExistingList(name, userId);
    const existingUser = await findExistingUserById(userId);

    if (existingList) {
        return res.json({ message: 'List name already exist' });
    } else if (!existingUser) {
        return res.json({ message: 'User does not exist' });
    } else if (userId !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    const createdList = new List({
        name,
        user: existingUser.id,
        tasks: []
    });

    try {
        await saveNewList(createdList, existingUser);
        return res.json({
            _id: createdList._id,
            name
        });
    } catch (e) {
        console.log(e);
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
        const existingList = await List.findOne({ name: newName });
        existingListName = existingList?.name;
    } catch (e) {
        return res.json({ error: e });
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
    if (existingListName && existingListName !== list.name) {
        return res.json({ message: 'List name already exist' });
    }

    // @ts-ignore
    if (list.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    list.name = newName;
    try {
        await list.save();
        return res.json(list);
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
        return res.json({ deletedListId: listId });
    } catch (e) {
        return res.json({ error: e });
    }
}
