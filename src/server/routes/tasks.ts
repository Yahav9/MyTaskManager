import { Router } from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/tasks';

const router = Router();

router
    .get('/:listId', getTasks)
    .post('/:listId', createTask)
    .put('/:taskId', updateTask)
    .delete('/:taskId', deleteTask)

export default router;