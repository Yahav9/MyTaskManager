import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { Types } from 'mongoose';
import { ListDoc } from '../models/List';

async function findExistingUserByName(name: string) {
    let existingUser;
    try {
        existingUser = await User.findOne({ name });
    } catch (e) {
        return console.log(e);
    }
    return existingUser;
}

async function hashPassword(password: string) {
    let hashedPassword: string | null;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        return console.log(e);
    }
    return hashedPassword;
}

async function createUserAndReturnUserId(newUser: IUser) {
    const createdUser = new User(newUser);
    try {
        await createdUser.save();
    } catch (e) {
        return console.log(e);
    }
    return createdUser.id;
}

async function createToken(userId: string) {
    const key = process.env.KEY as string;
    let token;
    try {
        token = jwt.sign(
            { userId },
            key,
            { expiresIn: '1h' });
    } catch (e) {
        return console.log(e);
    }
    return token;
}

async function checkPasswordIsCorrect(password: string, hashedPassword: string) {
    let isCorrectPassword = false;
    try {
        isCorrectPassword = await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        return console.log(e);
    }
    return isCorrectPassword;
}

export async function signup(req: Request, res: Response) {
    const name = req.body.name as string;
    const password = req.body.password as string;
    const existingUser = await findExistingUserByName(name);

    if (existingUser) {
        return res.json({ message: 'Username already exist' });
    }

    const hashedPassword = await hashPassword(password) as string;
    const newUser = {
        name,
        password: hashedPassword,
        lists: [] as unknown as Types.Array<ListDoc>
    };
    const createdUserId = await createUserAndReturnUserId(newUser);
    const token = await createToken(createdUserId);
    res.json({ userId: createdUserId, token });
}

export async function login(req: Request, res: Response) {
    const name = req.body.name as string;
    const password = req.body.password as string;
    const existingUser = await findExistingUserByName(name);

    if (!existingUser) {
        return res.json({ message: 'wrong username' });
    }

    const isCorrectPassword = await checkPasswordIsCorrect(password, existingUser.get('password')) as boolean;
    if (!isCorrectPassword) {
        return res.json({ message: 'Incorrect password' });
    }

    const token = await createToken(existingUser.get('id'));
    res.json({ userId: existingUser.get('id'), token });
}
