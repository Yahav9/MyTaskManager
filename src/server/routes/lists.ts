import { Router } from 'express';
import { changeListName, createList, deleteList, getLists } from '../controllers/lists';

const router = Router();

router
    .get('/:userId', getLists)
    .post('/:userId', createList)
    .put('/:listId', changeListName)
    .delete('/:listId', deleteList);

export default router;