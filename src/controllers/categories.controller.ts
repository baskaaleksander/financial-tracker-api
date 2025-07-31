import * as categoriesService from '../services/categories.service';
import { NextFunction, Request, Response } from 'express';

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const categoryData = req.body;
    const category = await categoriesService.createCategory(
      categoryData,
      userId,
    );
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const categoryData = req.body;
    const category = await categoriesService.updateCategory(
      req.params.id,
      categoryData,
      userId,
    );
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    await categoriesService.deleteCategory(req.params.id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const categories = await categoriesService.getCategoriesByUserId(userId);
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const category = await categoriesService.getCategoryById(
      req.params.id,
      userId,
    );
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
