import { Request, Response } from 'express';
import { Document, MergeType, Types, startSession } from 'mongoose';
import List, { IList } from '../models/List';
import Task from '../models/Task';
import User, { IUser } from '../models/User';

export type UserDoc = Document<unknown, unknown, IUser> & IUser & { _id: Types.ObjectId }
export type ListDoc = Document<unknown, unknown, IList> & IList & { _id: Types.ObjectId }

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

async function findExistingListById(listId: Types.ObjectId) {
    let existingList;
    try {
        existingList = await List.findById(listId);
    } catch (e) {
        return console.log(e);
    }
    return existingList;
}

async function saveNewListOnDB(createdList: ListDoc, user: UserDoc): Promise<void> {
    try {
        const sess = await startSession();
        sess.startTransaction();
        await createdList.save({ session: sess });
        user.lists.push(createdList.id);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (e) {
        return console.log(e);
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
        await saveNewListOnDB(createdList, existingUser);
        return res.json({
            _id: createdList._id,
            name
        });
    } catch (e) {
        console.log(e);
    }

}

export async function getLists(req: Request, res: Response) {
    if (req.params.userId !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    const userId = new Types.ObjectId(req.params.userId);
    try {
        const lists = await List.find({ user: userId });
        return res.json(lists);
    } catch (e) {
        return res.json({ message: 'Wrong user id' });
    }
}

export async function changeListName(req: Request, res: Response) {
    const newName = req.body.name;
    const user = req.userId as string;
    const listNameAlreadyExists = !!(await findExistingList(newName, user));
    const existingList = await findExistingListById(new Types.ObjectId(req.params.listId));

    if (!existingList) {
        return res.json({ message: 'wrong list id' });
    } else if (listNameAlreadyExists) {
        return res.json({ message: 'List name already exist' });
    } else if (existingList.user.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    existingList.name = newName;
    try {
        await existingList.save();
        return res.json(existingList);
    } catch (e) {
        return res.json({ error: e });
    }
}

export async function deleteList(req: Request, res: Response) {
    const listId = new Types.ObjectId(req.params.listId);
    const list = await (await findExistingListById(listId))?.populate<{ user: UserDoc }>('user');

    if (!list) {
        return res.json({ message: 'wrong list id' });
    } else if (list.user._id.toString() !== req.userId) {
        return res.json({ message: 'Authentication failed' });
    }

    try {
        await removeListFromDB(list, listId);
        return res.json({ deletedListId: listId });
    } catch (e) {
        return res.json({ error: e });
    }
}
