import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z
    .email({ message: 'Invalid email address' })
    .min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginUserSchema = z.object({
  email: z
    .email({ message: 'Invalid email address' })
    .min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type LoginUserSchema = z.infer<typeof loginUserSchema>;
