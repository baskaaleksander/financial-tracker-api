import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);

    res.cookie('refresh_token', user.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        access_token: user.access_token,
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.logoutUser(req.user?.id);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Missing refresh token' });
    }
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ access_token: newAccessToken });
  } catch (error) {
    next(error);
  }
};
