import express from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { validate } from '../middlewares/validate';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  validate(createCategorySchema),
  categoriesController.createCategory,
);

router.put(
  '/:id',
  validate(updateCategorySchema),
  categoriesController.updateCategory,
);

router.delete('/:id', categoriesController.deleteCategory);

router.get('/', categoriesController.getCategories);

router.get('/:id', categoriesController.getCategory);

export default router;
