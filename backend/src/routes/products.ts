import { Router } from 'express';
import { getProduct, listProducts } from '../controllers/productController.js';

export const productsRouter = Router();
productsRouter.get('/', listProducts);
productsRouter.get('/:id', getProduct);
