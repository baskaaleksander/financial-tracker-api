import Category from '../models/category.model';
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
    throw new Error('Category already exists');
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
    throw new Error('Category not found');
  }

  if (category.userId.toString() !== userId) {
    throw new Error('You can only update your own categories');
  }

  Object.assign(category, categoryData);
  await category.save();
  return category;
};

export const deleteCategory = async (id: string, userId: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error('Category not found');
  }

  if (category.userId.toString() !== userId) {
    throw new Error('You can only delete your own categories');
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
    throw new Error('Category not found');
  }

  if (category.userId.toString() !== userId) {
    throw new Error('You can only access your own categories');
  }

  return category;
};
