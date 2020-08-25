import { Router } from 'express';

import {
    registerUser, accountActivation,
    loginUser,
    getUserData,
    forgotPassword, resetPassword
} from '../controller/AuthController';
import { auth } from '../middleware/Auth';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/Auth';
import { runValidation } from '../validators/index';


const router = Router();

/**
 * @route /api/auth/
 */
router.post('/register', registerValidator, runValidation, registerUser);
router.post('/account-activation', accountActivation);
router.post('/login', loginValidator, runValidation, loginUser);
router.get('/user', auth, getUserData);
//forget rest password
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);
export default router;