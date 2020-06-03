import { Router } from 'express';

import { loginUser, registerUser, getUserData } from '../controller/AuthController';
import { auth } from '../middleware/Auth';

const router = Router();

/**
 * @route /api/auth/
 */
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', auth, getUserData);

export default router;