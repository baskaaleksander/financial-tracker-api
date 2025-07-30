import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from '../../src/services/auth.service';
import User from '../../src/models/user.model';
import RefreshToken from '../../src/models/refresh-token.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../src/config/env';

// Mock dependencies
jest.mock('../../src/models/user.model');
jest.mock('../../src/models/refresh-token.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/env', () => ({
  jwtSecret: 'test-jwt-secret',
  jwtSecretRefresh: 'test-refresh-secret',
}));

// Type the mocks properly
const mockUser = User as jest.MockedFunction<any>;
const mockRefreshToken = RefreshToken as jest.MockedFunction<any>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// Mock the static methods
mockUser.findOne = jest.fn();
mockUser.findById = jest.fn();
mockRefreshToken.findOne = jest.fn();
mockRefreshToken.deleteOne = jest.fn();

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const userData = {
      firstName: 'John',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const savedUser = {
        _id: 'userId123',
        firstName: 'John',
        email: 'john@example.com',
        password: hashedPassword,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(null);
      (
        mockBcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>
      ).mockResolvedValue(hashedPassword as never);
      mockUser.mockImplementation(() => savedUser);

      const result = await registerUser(userData);

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(savedUser.save).toHaveBeenCalled();
      expect(result).toBe(savedUser);
    });

    it('should throw error if user already exists', async () => {
      const existingUser = { _id: 'existingUserId', email: userData.email };

      mockUser.findOne.mockResolvedValue(existingUser);

      await expect(registerUser(userData)).rejects.toThrow(
        'User already exists',
      );
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    const email = 'john@example.com';
    const password = 'password123';
    const userId = 'userId123';
    const accessToken = 'accessToken123';
    const refreshToken = 'refreshToken123';

    const mockUserDoc = {
      _id: userId,
      firstName: 'John',
      email,
      password: 'hashedPassword',
    };

    it('should login user successfully', async () => {
      const mockRefreshTokenDoc = {
        userId,
        token: refreshToken,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc);
      (
        mockBcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>
      ).mockResolvedValue(true as never);
      (mockJwt.sign as jest.MockedFunction<typeof jwt.sign>)
        .mockReturnValueOnce(accessToken as never)
        .mockReturnValueOnce(refreshToken as never);
      mockRefreshToken.findOne.mockResolvedValue(null);
      mockRefreshToken.mockImplementation(() => mockRefreshTokenDoc);

      const result = await loginUser(email, password);

      expect(mockUser.findOne).toHaveBeenCalledWith({ email });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserDoc.password,
      );
      expect(mockJwt.sign).toHaveBeenCalledWith({ userId }, config.jwtSecret, {
        expiresIn: '15m',
      });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId },
        config.jwtSecretRefresh,
        { expiresIn: '30d' },
      );
      expect(mockRefreshTokenDoc.save).toHaveBeenCalled();

      expect(result).toEqual({
        id: userId,
        firstName: 'John',
        email,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    });

    it('should delete existing refresh token before creating new one', async () => {
      const existingRefreshToken = {
        userId,
        token: 'oldToken',
        deleteOne: jest.fn().mockResolvedValue(true),
      };
      const mockRefreshTokenDoc = {
        userId,
        token: refreshToken,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc);
      (
        mockBcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>
      ).mockResolvedValue(true as never);
      (mockJwt.sign as jest.MockedFunction<typeof jwt.sign>)
        .mockReturnValueOnce(accessToken as never)
        .mockReturnValueOnce(refreshToken as never);
      mockRefreshToken.findOne.mockResolvedValue(existingRefreshToken);
      mockRefreshToken.mockImplementation(() => mockRefreshTokenDoc);

      await loginUser(email, password);

      expect(existingRefreshToken.deleteOne).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await expect(loginUser(email, password)).rejects.toThrow(
        'Invalid email or password',
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      mockUser.findOne.mockResolvedValue(mockUserDoc);
      (
        mockBcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>
      ).mockResolvedValue(false as never);

      await expect(loginUser(email, password)).rejects.toThrow(
        'Invalid email or password',
      );
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('logoutUser', () => {
    const userId = 'userId123';

    it('should logout user successfully', async () => {
      mockRefreshToken.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await logoutUser(userId);

      expect(mockRefreshToken.deleteOne).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });

  describe('refreshAccessToken', () => {
    const userId = 'userId123';
    const refreshToken = 'refreshToken123';
    const newAccessToken = 'newAccessToken123';
    const mockUserDoc = {
      _id: userId,
      firstName: 'John',
      email: 'john@example.com',
    };

    it('should refresh access token successfully', async () => {
      const payload = { userId };

      (
        mockJwt.verify as jest.MockedFunction<typeof jwt.verify>
      ).mockReturnValue(payload as any);
      mockUser.findById.mockResolvedValue(mockUserDoc);
      (mockJwt.sign as jest.MockedFunction<typeof jwt.sign>).mockReturnValue(
        newAccessToken as never,
      );

      const result = await refreshAccessToken(refreshToken);

      expect(mockJwt.verify).toHaveBeenCalledWith(
        refreshToken,
        config.jwtSecretRefresh,
      );
      expect(mockUser.findById).toHaveBeenCalledWith(userId);
      expect(mockJwt.sign).toHaveBeenCalledWith({ userId }, config.jwtSecret, {
        expiresIn: '15m',
      });
      expect(result).toEqual({ access_token: newAccessToken });
    });

    it('should throw error if refresh token is not provided', async () => {
      await expect(refreshAccessToken('')).rejects.toThrow(
        'Refresh token is required',
      );
      expect(mockJwt.verify).not.toHaveBeenCalled();
    });

    it('should throw error if refresh token is invalid', async () => {
      (
        mockJwt.verify as jest.MockedFunction<typeof jwt.verify>
      ).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(refreshAccessToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(mockUser.findById).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const payload = { userId };

      (
        mockJwt.verify as jest.MockedFunction<typeof jwt.verify>
      ).mockReturnValue(payload as any);
      mockUser.findById.mockResolvedValue(null);

      await expect(refreshAccessToken(refreshToken)).rejects.toThrow(
        'User not found',
      );
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
  });
});
