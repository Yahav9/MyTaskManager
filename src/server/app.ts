import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import users from './routes/users';
import lists from './routes/lists';
import tasks from './routes/tasks';

dotenv.config();

const app: Express = express();
app.use(cors())
  .use(json());

app.use('/api/users', users)
  .use('/api/lists', lists)
  .use('/api/tasks', tasks);


const port = process.env.PORT || 4000;
const connectionString = process.env.URL || 'connection string'

mongoose.connect(connectionString)
  .then(() => {
    app.listen(port, () => {
      console.log('Hosted: http://localhost:' + port);
      console.log('connected to db');
    })
  })
  .catch(e => {
    console.log('could not connect to db', e);
  });
