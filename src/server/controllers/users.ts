import { Request, Response } from 'express';
import User from '../models/User';


export async function signup(req: Request, res: Response) {
    const { name, password } = req.body as any;
    let existingUser;
    try {
        existingUser = await User.findOne({ name: name });
    } catch (e) {
        console.log(e);
    }

    if (existingUser) {
        res.json({ message: 'Username already exist' });
    } else {
        const createdUser = new User({
            name,
            password,
            lists: []
        });
        createdUser.save()
            .then(() => res.json(createdUser))
            .catch(e => console.log(e));
    }
}

export async function login(req: Request, res: Response) {
    const { name, password } = req.body as any;
    let existingUser;
    try {
        existingUser = await User.findOne({ name: name, password: password });
    } catch (e) {
        console.log(e);
    }
    if (existingUser) {
        res.json({ id: existingUser._id })
    } else {
        res.json({ message: 'Wrong password or username' })
    }
}