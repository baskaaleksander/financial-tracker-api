import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import config from '../config/env';
import { UserPayload, AuthRequest } from '../utils/types';

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Missing JWT token' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid JWT token' });
    }
    req.user = user as UserPayload;
    next();
  });
};
