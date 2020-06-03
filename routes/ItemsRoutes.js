import { Router } from 'express';

import { auth } from '../middleware/Auth';
import { getItems, postItem, deleteItem } from '../controller/ItemController';


const router = Router();

router.get('/', getItems);
router.post('/', auth, postItem);
router.delete('/:id', auth, deleteItem);

export default router;