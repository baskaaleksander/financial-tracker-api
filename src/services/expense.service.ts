import Expense from '../models/expense.model';
import {
  CreateExpenseSchema,
  UpdateExpenseSchema,
} from '../validators/expense.validator';

export const createExpense = async (
  data: CreateExpenseSchema,
  userId: string,
) => {
  const expense = new Expense({ ...data, userId });
  await expense.save();
  return expense;
};

export const updateExpense = async (
  id: string,
  data: UpdateExpenseSchema,
  userId: string,
) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new Error('Expense not found');
  }
  if (userId !== expense.userId.toString()) {
    throw new Error('You can only update your own expenses');
  }

  Object.assign(expense, data);
  await expense.save();

  return expense;
};

export const deleteExpense = async (id: string, userId: string) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new Error('Expense not found');
  }
  if (userId !== expense.userId.toString()) {
    throw new Error('You can only delete your own expenses');
  }

  await expense.deleteOne();
  return { message: 'Expense deleted successfully' };
};
export const getExpenseById = async (id: string, userId: string) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error('Expense not found');
  }
  if (userId !== expense.userId.toString()) {
    throw new Error('You can only view your own expenses');
  }
  return expense;
};
export const getExpensesByUserId = async (userId: string) => {
  const expenses = await Expense.find({ userId }).populate('userId');
  return expenses;
};
