import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import users from './routes/users';
import lists from './routes/lists';
import tasks from './routes/tasks';
import { checkAuth } from './middleware/checkAuth';
dotenv.config();

const port = process.env.PORT || '4000';
const connectionString = process.env.URL || 'no connection string';
const app = express();

app.use(cors())
    .use(json())
    .use((_req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Headers', 'Authorization');
        next();
    });

app.use('/api/users', users)
    .use(checkAuth)
    .use('/api/lists', lists)
    .use('/api/tasks', tasks);

export async function connectToDataBase() {
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(connectionString);
    } catch (err) {
        console.log('could not connect to db, error: ', err);
        console.log('connectionString: ', connectionString);
    }
}

export async function listenToPort() {
    app.listen(port, () => {
        console.log('Hosted: http://localhost:' + port);
        console.log('connected to db');
    });
}

function runServer() {
    if (process.env.NODE_ENV !== 'test') {
        connectToDataBase();
        listenToPort();
    }
}

export default app;

runServer();
