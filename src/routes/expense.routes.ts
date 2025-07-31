import express from 'express';
import * as expenseController from '../controllers/expense.controller';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validators/transaction.validator';

const router = express.Router();

router.post(
  '/',
  validate(createTransactionSchema),
  authMiddleware,
  expenseController.createExpense,
);

router.put(
  '/:id',
  validate(updateTransactionSchema),
  authMiddleware,
  expenseController.updateExpense,
);

router.delete('/:id', authMiddleware, expenseController.deleteExpense);

router.get('/:id', authMiddleware, expenseController.getExpenseById);

router.get('/', authMiddleware, expenseController.getExpensesByUserId);

export default router;
