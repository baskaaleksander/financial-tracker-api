import { AppError } from '../middlewares/error.middleware.js';
import Category from '../models/category.model.js';
import Transaction from '../models/transaction.model.js';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from '../validators/transaction.validator.js';

export const createTransaction = async (
  data: CreateTransactionSchema,
  userId: string,
) => {
  const category = await Category.findOne({ name: data.category, userId });

  if (!category) {
    throw new Error('Category not found');
  }

  const transaction = new Transaction({
    amount: data.amount,
    type: data.type,
    description: data.description,
    categoryName: data.category,
    categoryId: category._id,
    userId,
  });
  await transaction.save();
  return transaction;
};

export const updateTransaction = async (
  id: string,
  data: UpdateTransactionSchema,
  userId: string,
) => {
  const transaction = await Transaction.findById(id);

  if (!transaction) {
    const error = Error('Transaction not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  if (userId !== transaction.userId.toString()) {
    const error = Error(
      'You can only update your own transactions',
    ) as AppError;
    error.statusCode = 403;
    throw error;
  }

  const category = data.category
    ? await Category.findOne({
        name: data.category,
        userId,
      })
    : null;

  if (data.category && !category) {
    const error = Error('Category not found') as AppError;
    error.statusCode = 404;
    throw error;
  }

  Object.assign(transaction, {
    amount: data.amount ?? transaction.amount,
    description: data.description ?? transaction.description,
    date: data.date ? new Date(data.date) : transaction.date,
    categoryName: data.category ?? transaction.categoryName,
    categoryId: category ? category._id : transaction.categoryId,
  });

  await transaction.save();

  return transaction;
};

export const deleteTransaction = async (id: string, userId: string) => {
  const transaction = await Transaction.findById(id);

  if (!transaction) {
    const error = Error('Transaction not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  if (userId !== transaction.userId.toString()) {
    const error = Error(
      'You can only delete your own transactions',
    ) as AppError;
    error.statusCode = 403;
    throw error;
  }

  await transaction.deleteOne();
  return { message: 'Transaction deleted successfully' };
};
export const getTransactionById = async (id: string, userId: string) => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    const error = Error('Transaction not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  if (userId !== transaction.userId.toString()) {
    const error = Error('You can only view your own transactions') as AppError;
    error.statusCode = 403;
    throw error;
  }
  return transaction;
};
export const getTransactionsByUserId = async (userId: string) => {
  const transactions = await Transaction.find({ userId }).populate('userId');
  return transactions;
};
