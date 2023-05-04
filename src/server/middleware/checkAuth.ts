import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        return res.json({ message: 'Authentication failed!!' });
    }

    try {
        const key = process.env.KEY as string;
        const decodedToken = jwt.verify(token, key) as jwt.JwtPayload;
        req.userId = decodedToken.userId;
        next();
    } catch (e) {
        return res.json({ error: e });
    }
}
