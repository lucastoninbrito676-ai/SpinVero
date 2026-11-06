import { Router } from 'express';
import { authRouter } from './auth.js';
import { productsRouter } from './products.js';
import { profileRouter } from './profile.js';
import { usersRouter } from './users.js';

export const apiRouter = Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/users', usersRouter);
