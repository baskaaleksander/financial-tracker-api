import { SaveReportSchema } from '../validators/report.validator';
import Report from '../models/report.model';
import Transaction from '../models/transaction.model';
import { CategoryBreakdown, DailyBreakdown } from '../utils/types';
import { AppError } from '../middlewares/error.middleware';

export const saveReport = async (reportData: SaveReportSchema) => {
  const report = new Report({
    userId: reportData.userId,
    dateFrom: reportData.dateFrom,
    dateTo: reportData.dateTo,
    totalIncome: reportData.totalIncome,
    totalExpenses: reportData.totalExpenses,
    netBalance: reportData.netBalance,
    incomeByCategory: reportData.incomeByCategory,
    expensesByCategory: reportData.expensesByCategory,
    dailyBreakdown: reportData.dailyBreakdown,
  });

  await report.save();
  return report;
};

export const getReportFromToDate = async (
  userId: string,
  fromDate: Date,
  toDate: Date,
) => {
  const allTransactions = await Transaction.find({
    userId,
    date: {
      $gte: fromDate,
      $lt: toDate,
    },
  });

  const totalIncome = allTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const categoryBreakdown = allTransactions.reduce<CategoryBreakdown>(
    (acc, transaction) => {
      const category = transaction.categoryName || 'Uncategorized';
      if (!acc[transaction.type][category]) {
        acc[transaction.type][category] = 0;
      }
      acc[transaction.type][category] += transaction.amount;
      return acc;
    },
    { income: {}, expense: {} },
  );

  const dailyBreakdown = allTransactions.reduce<DailyBreakdown>(
    (acc, transaction) => {
      const date = transaction.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0, netBalance: 0 };
      }
      acc[date][transaction.type] += transaction.amount;
      acc[date].netBalance +=
        transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount;
      return acc;
    },
    {},
  );

  return {
    userId,
    dateFrom: fromDate,
    dateTo: toDate,
    totalIncome,
    totalExpenses,
    netBalance,
    byCategory: categoryBreakdown,
    dailyBreakdown,
  };
};

export const getLastMonthReport = async (userId: string) => {
  const lastMonth = new Date();
  lastMonth.setDate(1);
  lastMonth.setHours(0, 0, 0, 0);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  return getReportFromToDate(userId, lastMonth, new Date());
};

export const getAllReports = async (userId: string) => {
  return Report.find({ userId }).sort({ dateFrom: -1 });
};

export const getReportById = async (id: string, userId: string) => {
  return Report.findOne({ _id: id, userId });
};

export const deleteReport = async (id: string, userId: string) => {
  const report = await Report.findOne({ _id: id, userId });

  if (!report) {
    const error = Error('Report not found') as AppError;
    error.statusCode = 404;
    throw error;
  }

  await Report.deleteOne({ _id: id });
  return report;
};
