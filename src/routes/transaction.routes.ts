import express from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validators/transaction.validator';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  validate(createTransactionSchema),
  transactionController.createTransaction,
);

router.put(
  '/:id',
  validate(updateTransactionSchema),
  transactionController.updateTransaction,
);

router.delete('/:id', transactionController.deleteTransaction);

router.get('/:id', transactionController.getTransactionById);

router.get('/', transactionController.getTransactionsByUserId);

export default router;
