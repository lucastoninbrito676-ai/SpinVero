import { Router } from 'express';
import { login, logout, me, refresh, register, updateMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.get('/me', requireAuth, me);
authRouter.patch('/me', requireAuth, updateMe);
authRouter.post('/logout', requireAuth, logout);
