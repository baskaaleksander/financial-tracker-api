import { z } from 'zod';

export const saveReportSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  dateFrom: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date format',
  }),
  dateTo: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date format',
  }),
  totalIncome: z.number().default(0),
  totalExpenses: z.number().default(0),
  netBalance: z.number().default(0),
  incomeByCategory: z.array(
    z.object({
      categoryId: z.string().min(1, 'Category ID is required'),
      totalAmount: z.number().default(0),
    }),
  ),
  expensesByCategory: z.array(
    z.object({
      categoryId: z.string().min(1, 'Category ID is required'),
      totalAmount: z.number().default(0),
    }),
  ),
  dailyBreakdown: z.array(
    z.object({
      date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
      totalIncome: z.number().default(0),
      totalExpenses: z.number().default(0),
      netBalance: z.number().default(0),
    }),
  ),
});

export type SaveReportSchema = z.infer<typeof saveReportSchema>;
