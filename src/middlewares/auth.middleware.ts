import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import config from '../config/env.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Missing JWT token' });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid JWT token' });
    }

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      typeof (decoded as { userId?: unknown }).userId === 'string'
    ) {
      const { userId } = decoded as { userId: string };
      req.user = { userId };
      return next();
    }

    return res.status(403).json({ message: 'Invalid JWT token' });
  });
};
