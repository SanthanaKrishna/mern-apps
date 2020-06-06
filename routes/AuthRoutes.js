import { Router } from 'express';

import {
    registerUser, accountActivation,
    loginUser,
    getUserData,
} from '../controller/AuthController';
import { auth } from '../middleware/Auth';
import { registerValidator, loginValidator } from '../validators/Auth';
import { runValidation } from '../validators/index';


const router = Router();

/**
 * @route /api/auth/
 */
router.post('/register', registerValidator, runValidation, registerUser);
router.post('/account-activation', accountActivation);
router.post('/login', loginValidator, runValidation, loginUser);
router.get('/user', auth, getUserData);

export default router;