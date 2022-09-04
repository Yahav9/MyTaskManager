import express from 'express';
import { createUser, getUserName } from '../../postgres/users';

const router = express.Router();

router
    .route('/')
    .get(async (req, res) => {
        res.json(await getUserName(req.query.name!.toString()))
    })
    .post((req, res) => {
        createUser(req.body.name!.toString())
            .then(async () => res.json(await getUserName(req.body.name!.toString())))
    })
export default router;