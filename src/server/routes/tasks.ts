import { Router } from 'express';
import { createTask, deleteTask, getTasks, editTask, updateTaskStatus } from '../controllers/tasks';

const router = Router();

router
    .get('/:listId', getTasks)
    .post('/:listId', createTask)
    .put('/:taskId', editTask)
    .patch('/:taskId', updateTaskStatus)
    .delete('/:taskId', deleteTask);

export default router;
