import Category from '../models/category.model';
import Expense from '../models/expense.model';
import {
  CreateExpenseSchema,
  UpdateExpenseSchema,
} from '../validators/expense.validator';

export const createExpense = async (
  data: CreateExpenseSchema,
  userId: string,
) => {
  const category = await Category.findOne({ name: data.category, userId });

  if (!category) {
    throw new Error('Category not found');
  }

  const expense = new Expense({
    amount: data.amount,
    description: data.description,
    categoryName: data.category,
    categoryId: category._id,
    userId,
  });
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

  const category = await Category.findOne({
    name: data.category,
    userId,
  });

  if (data.category && !category) {
    throw new Error('Category not found');
  }

  Object.assign(expense, {
    amount: data.amount ?? expense.amount,
    description: data.description ?? expense.description,
    date: data.date ? new Date(data.date) : expense.date,
    categoryName: data.category ?? expense.categoryName,
    categoryId: category ? category._id : expense.categoryId,
  });

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
