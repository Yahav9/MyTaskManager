import { Request, Response } from 'express';
import { MergeType, Types, startSession } from 'mongoose';
import List, { ListDoc } from '../models/List';
import Task from '../models/Task';
import User, { UserDoc } from '../models/User';

async function findExistingList(name: string, userId: string) {
    let existingList;
    try {
        existingList = await List.findOne({ name: name, user: userId });
    } catch (e) {
        console.log(e);
        return;
    }
    return existingList;
}

async function findExistingUserById(userId: string) {
    let existingUser;
    try {
        existingUser = await User.findById(userId);
    } catch (e) {
        console.log(e);
        return;
    }
    return existingUser;
}

export async function findExistingListById(listId: Types.ObjectId) {
    let existingList;
    try {
        existingList = await List.findById(listId);
    } catch (e) {
        console.log(e);
        return;
    }
    return existingList;
}

async function saveNewListOnDB(createdList: ListDoc, user: UserDoc) {
    try {
        const sess = await startSession();
        sess.startTransaction();
        await createdList.save({ session: sess });
        user.lists.push(createdList.id);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (e) {
        console.log(e);
    }
}

async function removeListFromDB(list: MergeType<ListDoc, { user: UserDoc }>, listId: Types.ObjectId) {
    try {
        const sess = await startSession();
        sess.startTransaction();
        await list.remove({ session: sess });
        list.user.lists.pull(list);
        await list.user.save({ session: sess });
        await Task.deleteMany({ list: listId });
        await sess.commitTransaction();
    } catch (e) {
        console.log(e);
    }
}

export async function createList(req: Request, res: Response) {
    const name = req.body.name as string;
    const userId = req.params.userId as string;
    const existingList = await findExistingList(name, userId);
    const existingUser = await findExistingUserById(userId);

    if (existingList) {
        res.json({ message: 'List name already exist' });
        return;
    } else if (!existingUser) {
        res.json({ message: 'User does not exist' });
        return;
    } else if (userId !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    const createdList = new List({
        name,
        user: existingUser.id,
        tasks: []
    });

    try {
        await saveNewListOnDB(createdList, existingUser);
        res.json({ _id: createdList._id, name });
    } catch (e) {
        res.json(e);
    }
}

export async function getLists(req: Request, res: Response) {
    if (req.params.userId !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    const userId = new Types.ObjectId(req.params.userId);
    try {
        const lists = await List.find({ user: userId });
        res.json(lists);
    } catch (e) {
        res.json(e);
    }
}

export async function changeListName(req: Request, res: Response) {
    const newName = req.body.name;
    const user = req.userId as string;
    const listNameAlreadyExists = !!(await findExistingList(newName, user));
    const existingList = await findExistingListById(new Types.ObjectId(req.params.listId));

    if (!existingList) {
        res.json({ message: 'wrong list id' });
        return;
    } else if (listNameAlreadyExists) {
        res.json({ message: 'List name already exist' });
        return;
    } else if (existingList.user.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    existingList.name = newName;
    try {
        await existingList.save();
        res.json(existingList);
    } catch (e) {
        res.json(e);
    }
}

export async function deleteList(req: Request, res: Response) {
    const listId = new Types.ObjectId(req.params.listId);
    const list = await (await findExistingListById(listId))?.populate<{ user: UserDoc }>('user');

    if (!list) {
        res.json({ message: 'wrong list id' });
        return;
    } else if (list.user._id.toString() !== req.userId) {
        res.json({ message: 'Authentication failed' });
        return;
    }

    try {
        await removeListFromDB(list, listId);
        res.json({ deletedListId: listId });
    } catch (e) {
        res.json(e);
    }
}
