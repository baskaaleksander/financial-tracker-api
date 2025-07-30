import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/env';

export interface AuthRequest extends Request {
  user?: any;
  cookies: {
    token?: string;
  };
}

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
    req.user = user;
    next();
  });
};
