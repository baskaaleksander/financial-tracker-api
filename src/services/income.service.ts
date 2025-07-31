import Category from '../models/category.model';
import Income from '../models/income.model';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from '../validators/transaction.validator';

export const createIncome = async (
  data: CreateTransactionSchema,
  userId: string,
) => {
  const category = await Category.findOne({ name: data.category, userId });

  if (!category) {
    throw new Error('Category not found');
  }

  const income = new Income({
    amount: data.amount,
    description: data.description,
    categoryName: data.category,
    categoryId: category._id,
    userId,
  });
  await income.save();
  return income;
};

export const updateIncome = async (
  id: string,
  data: UpdateTransactionSchema,
  userId: string,
) => {
  const income = await Income.findById(id);

  if (!income) {
    throw new Error('Income not found');
  }
  if (userId !== income.userId.toString()) {
    throw new Error('You can only update your own incomes');
  }

  const category = await Category.findOne({
    name: data.category,
    userId,
  });

  if (data.category && !category) {
    throw new Error('Category not found');
  }

  Object.assign(income, {
    amount: data.amount ?? income.amount,
    description: data.description ?? income.description,
    date: data.date ? new Date(data.date) : income.date,
    categoryName: data.category ?? income.categoryName,
    categoryId: category ? category._id : income.categoryId,
  });

  await income.save();

  return income;
};

export const deleteIncome = async (id: string, userId: string) => {
  const income = await Income.findById(id);

  if (!income) {
    throw new Error('Income not found');
  }
  if (userId !== income.userId.toString()) {
    throw new Error('You can only delete your own incomes');
  }

  await income.deleteOne();
  return { message: 'Income deleted successfully' };
};
export const getIncomeById = async (id: string, userId: string) => {
  const income = await Income.findById(id);
  if (!income) {
    throw new Error('Income not found');
  }
  if (userId !== income.userId.toString()) {
    throw new Error('You can only view your own incomes');
  }
  return income;
};
export const getIncomesByUserId = async (userId: string) => {
  const incomes = await Income.find({ userId }).populate('userId');
  return incomes;
};
