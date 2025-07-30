import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import RefreshToken from '../models/refresh-token.model';

export const registerUser = async (userData: {
  firstName: string;
  email: string;
  password: string;
}) => {
  const { firstName, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
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
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
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
    throw new Error('Refresh token is required');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwtSecretRefresh);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }

  const userId = payload.userId;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const newAccessToken = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  return { access_token: newAccessToken };
};
