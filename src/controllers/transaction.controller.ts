import * as transactionService from '../services/transaction.service';
import { NextFunction, Request, Response } from 'express';

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const transaction = await transactionService.createTransaction(
      req.body,
      req.user?.id,
    );
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body,
      req.user?.id,
    );
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user?.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user?.id,
    );
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const transactions = await transactionService.getTransactionsByUserId(
      req.user?.id,
    );
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
