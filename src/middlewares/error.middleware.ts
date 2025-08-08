import { NextFunction, Request, Response } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
