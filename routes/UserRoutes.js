import { Router } from 'express';
import { getUserDetails } from '../controller/UserController';

const router = Router();

router.post('/', getUserDetails);

export default router;