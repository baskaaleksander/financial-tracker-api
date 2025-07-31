import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  description: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  category: z.string().min(1, 'Category is required'),
});

export const updateExpenseSchema = z.object({
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

export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>;
