import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import users from './routes/users'

const app: Express = express();
app.use(cors());
app.use(json());

app.use('/users', users)

app.get('/', (_req, res) => {
  res.send('hello world');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Hosted: http://localhost:' + port);
});
