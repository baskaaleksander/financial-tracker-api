import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env';

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

  const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: '24h',
  });

  return {
    id: user._id,
    firstName: user.firstName,
    email: user.email,
    token: token,
  };
};
