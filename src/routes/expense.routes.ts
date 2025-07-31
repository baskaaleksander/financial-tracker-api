import express from 'express';
import * as expenseController from '../controllers/expense.controller';
import { validate } from '../middlewares/validate';
import { createExpenseSchema } from '../validators/expense.validator';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/',
  validate(createExpenseSchema),
  authMiddleware,
  expenseController.createExpense,
);

router.put(
  '/:id',
  validate(createExpenseSchema),
  authMiddleware,
  expenseController.updateExpense,
);

router.delete('/:id', authMiddleware, expenseController.deleteExpense);

router.get('/:id', authMiddleware, expenseController.getExpenseById);

router.get('/', authMiddleware, expenseController.getExpensesByUserId);

export default router;
