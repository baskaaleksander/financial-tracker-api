import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import RefreshToken from '../models/refresh-token.model';
import { AppError } from '../middlewares/error.middleware';

export interface UserPayload extends jwt.JwtPayload {
  userId: string;
}

export const registerUser = async (userData: {
  firstName: string;
  email: string;
  password: string;
}) => {
  const { firstName, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User already exists') as AppError;
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    throw error;
  }

  const access_token = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: '15m',
  });
  const existingRefreshToken = await RefreshToken.findOne({ userId: user._id });

  if (existingRefreshToken) {
    await existingRefreshToken.deleteOne();
  }

  const refresh_token = jwt.sign(
    { userId: user._id },
    config.jwtSecretRefresh,
    {
      expiresIn: '30d',
    },
  );

  const newRefreshToken = new RefreshToken({
    userId: user._id,
    token: refresh_token,
  });

  await newRefreshToken.save();

  return {
    id: user._id,
    firstName: user.firstName,
    email: user.email,
    access_token,
    refresh_token,
  };
};

export const logoutUser = async (userId: string) => {
  await RefreshToken.deleteOne({ userId });
  return { message: 'Logout successful' };
};
export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required') as AppError;
    error.statusCode = 400;
    throw error;
  }

  const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });

  if (!refreshTokenDoc) {
    const error = new Error('Invalid refresh token') as AppError;
    error.statusCode = 401;
    throw error;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwtSecretRefresh) as UserPayload;
  } catch (error) {
    const err = new Error('Invalid refresh token') as AppError;
    err.statusCode = 401;
    throw err;
  }

  const userId = payload.userId;
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found') as AppError;
    error.statusCode = 404;
    throw error;
  }

  const newAccessToken = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  return { access_token: newAccessToken };
};
