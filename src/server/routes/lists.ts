import { Router } from 'express';
import { changeListName, createList, getLists } from '../controllers/lists';

const router = Router();

router
    .get('/:userId', getLists)
    .post('/:userId', createList)
    .put('/:listId', changeListName)
// .delete('/:userId', deleteList);

export default router;