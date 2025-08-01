import Category from '../models/category.model';
import Transaction from '../models/transaction.model';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from '../validators/transaction.validator';

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
    throw new Error('Transaction not found');
  }
  if (userId !== transaction.userId.toString()) {
    throw new Error('You can only update your own transactions');
  }

  const category = await Category.findOne({
    name: data.category,
    userId,
  });

  if (data.category && !category) {
    throw new Error('Category not found');
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
    throw new Error('Transaction not found');
  }
  if (userId !== transaction.userId.toString()) {
    throw new Error('You can only delete your own transactions');
  }

  await transaction.deleteOne();
  return { message: 'Transaction deleted successfully' };
};
export const getTransactionById = async (id: string, userId: string) => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  if (userId !== transaction.userId.toString()) {
    throw new Error('You can only view your own transactions');
  }
  return transaction;
};
export const getTransactionsByUserId = async (userId: string) => {
  const transactions = await Transaction.find({ userId }).populate('userId');
  return transactions;
};
