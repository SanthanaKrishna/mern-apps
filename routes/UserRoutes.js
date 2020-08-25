import { Router } from 'express';
import { readUserDetails, updateUserDetails } from '../controller/UserController';

import { requireSignin, adminMiddleware } from '../middleware/Auth';

const router = Router();

/**
 * @route /api/user/
 */
router.get('/:id', requireSignin, readUserDetails);
router.put('/update', requireSignin, updateUserDetails);
router.put('/admin/update', requireSignin, adminMiddleware, updateUserDetails);

export default router;  