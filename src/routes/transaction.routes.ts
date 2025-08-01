import express from 'express';
import * as transactionController from '../controllers/transaction.controller';
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
  transactionController.createTransaction,
);

router.put(
  '/:id',
  authMiddleware,
  validate(updateTransactionSchema),
  transactionController.updateTransaction,
);

router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

router.get('/:id', authMiddleware, transactionController.getTransactionById);

router.get('/', authMiddleware, transactionController.getTransactionsByUserId);

export default router;
