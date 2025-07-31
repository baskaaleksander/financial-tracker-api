import * as expenseService from '../services/expense.service';
import { NextFunction, Request, Response } from 'express';

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expense = await expenseService.createExpense(req.body, req.user?.id);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.body,
      req.user?.id,
    );
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await expenseService.deleteExpense(req.params.id, req.user?.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expense = await expenseService.getExpenseById(
      req.params.id,
      req.user?.id,
    );
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export const getExpensesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expenses = await expenseService.getExpensesByUserId(req.user?.id);
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};
