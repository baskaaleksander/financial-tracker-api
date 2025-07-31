import express from 'express';
import * as incomeController from '../controllers/income.controller';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validators/transaction.validator';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validate(createTransactionSchema),
  incomeController.createIncome,
);

router.put(
  '/:id',
  authMiddleware,
  validate(updateTransactionSchema),
  incomeController.updateIncome,
);

router.delete('/:id', authMiddleware, incomeController.deleteIncome);

router.get('/:id', authMiddleware, incomeController.getIncomeById);

router.get('/', authMiddleware, incomeController.getIncomesByUserId);

export default router;
