import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import User from '../models/User';

export async function signup(req: Request, res: Response) {
    const { name, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ name: name });
    } catch (e) {
        return res.json({ error: e });
    }

    if (existingUser) {
        return res.json({ message: 'Username already exist' });
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        return res.json({ error: e });
    }

    const createdUser = new User({
        name,
        password: hashedPassword,
        lists: []
    });

    try {
        await createdUser.save();
    } catch (e) {
        return res.json({ error: e });
    }

    let token;
    try {
        process.env.KEY &&
            (token = jwt.sign(
                { userId: createdUser.id },
                process.env.KEY,
                { expiresIn: '1h' }));
    } catch (e) {
        return res.json({ error: e });
    }

    res.json({ userId: createdUser.id, token: token });
}

export async function login(req: Request, res: Response) {
    const { name, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ name: name });
    } catch (e) {
        return res.json({ error: e });
    }

    if (!existingUser) {
        return res.json({ message: 'wrong username' });
    }

    let isCorrectPassword = false;
    try {
        isCorrectPassword = await bcrypt.compare(password, existingUser.password);
    } catch (e) {
        return res.json({ error: e });
    }

    if (!isCorrectPassword) {
        return res.json({ message: 'Incorrect password' });
    }

    let token;
    try {
        process.env.KEY &&
            (token = jwt.sign(
                { userId: existingUser.id },
                process.env.KEY,
                { expiresIn: '1h' }));
    } catch (e) {
        return res.json({ error: e });
    }

    res.json({ userId: existingUser.id, token: token });
}
