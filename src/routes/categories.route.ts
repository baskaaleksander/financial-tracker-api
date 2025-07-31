import express from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { validate } from '../middlewares/validate';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validate(createCategorySchema),
  categoriesController.createCategory,
);

router.put(
  '/:id',
  authMiddleware,
  validate(updateCategorySchema),
  categoriesController.updateCategory,
);

router.delete('/:id', authMiddleware, categoriesController.deleteCategory);

router.get('/', authMiddleware, categoriesController.getCategories);

router.get('/:id', authMiddleware, categoriesController.getCategory);

export default router;
