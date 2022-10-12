import { Router } from 'express';
import { login, signup } from '../controllers/users';

const router = Router();

router
    .post('/signup', signup)
    .post('/login', login)

export default router;