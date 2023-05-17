import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { Types } from 'mongoose';
import { ListDoc } from '../models/List';

async function findExistingUserByName(name: string) {
    try {
        const existingUser = await User.findOne({ name });
        return existingUser;
    } catch (e) {
        console.log(e);
    }
}

async function hashPassword(password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        return hashedPassword;
    } catch (e) {
        console.log(e);
    }
}

async function createUserAndReturnUserId(newUser: IUser): Promise<Types.ObjectId | undefined> {
    const createdUser = new User(newUser);
    try {
        await createdUser.save();
        return createdUser.id;
    } catch (e) {
        console.log(e);
    }
}

async function createToken(userId: Types.ObjectId) {
    const key = process.env.KEY as string;
    try {
        const token = jwt.sign({ userId }, key, { expiresIn: '1h' });
        return token;
    } catch (e) {
        console.log(e);
    }
}

async function checkPasswordIsCorrect(password: string, hashedPassword: string) {
    try {
        const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
        return isCorrectPassword;
    } catch (e) {
        console.log(e);
    }
}

export async function signup(req: Request, res: Response) {
    const name = req.body.name as string;
    const password = req.body.password as string;
    const existingUser = await findExistingUserByName(name);

    if (existingUser) {
        res.json({ message: 'Username already exist' });
        return;
    }

    const hashedPassword = await hashPassword(password) as string;
    const newUser = {
        name,
        password: hashedPassword,
        lists: [] as unknown as Types.Array<ListDoc>
    };
    const createdUserId = await createUserAndReturnUserId(newUser) as Types.ObjectId;
    const token = await createToken(createdUserId);
    res.json({ userId: createdUserId, token });
}

export async function login(req: Request, res: Response) {
    const name = req.body.name as string;
    const password = req.body.password as string;
    const existingUser = await findExistingUserByName(name);

    if (!existingUser) {
        res.json({ message: 'wrong username' });
        return;
    }

    const isCorrectPassword = await checkPasswordIsCorrect(password, existingUser.get('password')) as boolean;
    if (!isCorrectPassword) {
        res.json({ message: 'Incorrect password' });
        return;
    }

    const token = await createToken(existingUser.get('id'));
    res.json({ userId: existingUser.get('id'), token });
}
