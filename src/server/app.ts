import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import users from './routes/users';
import lists from './routes/lists';
import tasks from './routes/tasks';
import { checkAuth } from './middleware/checkAuth';

dotenv.config();

const app: Express = express();
app.use(cors())
    .use(json());

app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    next();
});

app.use('/api/users', users)
    .use(checkAuth)
    .use('/api/lists', lists)
    .use('/api/tasks', tasks);

const port = process.env.PORT || 4000;
const connectionString = process.env.URL || 'connection string';

mongoose.connect(connectionString)
    .then(() => {
        app.listen(port, () => {
            console.log('Hosted: http://localhost:' + port);
            console.log('connected to db');
        });
    })
    .catch(e => {
        console.log('could not connect to db', e);
        console.log('connectionString: ', connectionString);
    });
