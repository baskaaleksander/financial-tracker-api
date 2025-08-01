import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  description: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  type: z.enum(['income', 'expense'], {
    message: 'Type must be either income or expense',
  }),
  category: z.string().min(1, 'Category is required'),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').optional(),
  description: z.string().optional(),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .optional(),
  category: z.string().min(1, 'Category is required').optional(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;
