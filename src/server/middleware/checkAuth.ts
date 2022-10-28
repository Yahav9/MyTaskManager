import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    let token;
    try {
        token = req.headers.authorization;
        if (!token) {
            return res.json({ message: 'Authentication failed' })
        }
        let decodedToken;
        process.env.KEY && (decodedToken = jwt.verify(token, process.env.KEY));
        // @ts-ignore
        req.userId = decodedToken.userId;
        next();
    } catch (e) {
        return res.json({ error: e });
    }
}