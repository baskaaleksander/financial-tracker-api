import * as transactionService from '../services/transaction.service.js';
import { NextFunction, Request, Response } from 'express';

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const transaction = await transactionService.createTransaction(
      req.body,
      userId,
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
    const userId = req.user?.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body,
      userId,
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
    const userId = req.user?.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    await transactionService.deleteTransaction(req.params.id, userId);
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
    const userId = req.user?.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const transaction = await transactionService.getTransactionById(
      req.params.id,
      userId,
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
    const userId = req.user?.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const transactions =
      await transactionService.getTransactionsByUserId(userId);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
