import * as incomeService from '../services/income.service';
import { NextFunction, Request, Response } from 'express';

export const createIncome = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const income = await incomeService.createIncome(req.body, req.user?.id);
    res.status(201).json(income);
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const income = await incomeService.updateIncome(
      req.params.id,
      req.body,
      req.user?.id,
    );
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await incomeService.deleteIncome(req.params.id, req.user?.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getIncomeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const income = await incomeService.getIncomeById(
      req.params.id,
      req.user?.id,
    );
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

export const getIncomesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const incomes = await incomeService.getIncomesByUserId(req.user?.id);
    res.status(200).json(incomes);
  } catch (error) {
    next(error);
  }
};
