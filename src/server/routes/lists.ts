import { Router } from 'express';
import { createList, getLists } from '../controllers/lists';

const router = Router();

router
    .get('/:userId', getLists)
    .post('/:userId', createList)
// .put('/:userId/:listId', changeListName)
// .delete('/:userId', deleteList);

export default router;