import { Router } from 'express';
import { getPublicUser } from '../controllers/userController.js';

export const usersRouter = Router();
usersRouter.get('/:id', getPublicUser);
