import { AppError } from '../middlewares/error.middleware.js';
import Category from '../models/category.model.js';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from '../validators/category.validator';

export const createCategory = async (
  categoryData: CreateCategorySchema,
  userId: string,
) => {
  const existingCategory = await Category.findOne({
    name: categoryData.name,
    userId: userId,
  });

  if (existingCategory) {
    const error = new Error('Category already exists') as AppError;
    error.statusCode = 409;
    throw error;
  }

  const category = new Category({ ...categoryData, userId });
  await category.save();
  return category;
};

export const updateCategory = async (
  id: string,
  categoryData: UpdateCategorySchema,
  userId: string,
) => {
  const category = await Category.findById(id);

  if (!category) {
    const error = new Error('Category not found') as AppError;
    error.statusCode = 404;
    throw error;
  }

  if (category.userId.toString() !== userId) {
    const error = new Error(
      'You can only update your own categories',
    ) as AppError;
    error.statusCode = 403;
    throw error;
  }

  Object.assign(category, categoryData);
  await category.save();
  return category;
};

export const deleteCategory = async (id: string, userId: string) => {
  const category = await Category.findById(id);

  if (!category) {
    const error = new Error('Category not found') as AppError;
    error.statusCode = 404;
    throw error;
  }

  if (category.userId.toString() !== userId) {
    const error = new Error(
      'You can only delete your own categories',
    ) as AppError;
    error.statusCode = 403;
    throw error;
  }

  await category.deleteOne();
  return { message: 'Category deleted successfully' };
};

export const getCategoriesByUserId = async (userId: string) => {
  const categories = await Category.find({ userId });
  return categories;
};
export const getCategoryById = async (id: string, userId: string) => {
  const category = await Category.findById(id);

  if (!category) {
    const error = new Error('Category not found') as AppError;
    error.statusCode = 404;
    throw error;
  }

  if (category.userId.toString() !== userId) {
    const error = new Error(
      'You can only access your own categories',
    ) as AppError;
    error.statusCode = 403;
    throw error;
  }

  return category;
};
