import {
  saveReport,
  getReportFromToDate,
  getLastMonthReport,
  getAllReports,
  getReportById,
  deleteReport,
} from '../../src/services/report.service';
import Report from '../../src/models/report.model';
import Transaction from '../../src/models/transaction.model';

jest.mock('../../src/models/report.model');
jest.mock('../../src/models/transaction.model');
jest.mock('../../src/validators/report.validator');

const mockReport = Report as jest.MockedFunction<any>;
const mockTransaction = Transaction as jest.MockedFunction<any>;

mockReport.find = jest.fn();
mockReport.findOne = jest.fn();
mockReport.deleteOne = jest.fn();
mockTransaction.find = jest.fn();

describe('Report Service', () => {
  const userId = 'userId123';
  const reportId = 'reportId123';
  const otherUserId = 'otherUserId456';

  const mockDate = new Date('2023-01-01');
  const mockToDate = new Date('2023-01-31');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-02-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('saveReport', () => {
    const reportData = {
      userId,
      dateFrom: mockDate.toISOString(),
      dateTo: mockToDate.toISOString(),
      totalIncome: 5000,
      totalExpenses: 3000,
      netBalance: 2000,
      incomeByCategory: [{ categoryId: 'Salary', totalAmount: 5000 }],
      expensesByCategory: [
        { categoryId: 'Food', totalAmount: 1500 },
        { categoryId: 'Transport', totalAmount: 1500 },
      ],
      dailyBreakdown: [
        {
          date: '2023-01-01',
          totalIncome: 5000,
          totalExpenses: 0,
          netBalance: 5000,
        },
        {
          date: '2023-01-15',
          totalIncome: 0,
          totalExpenses: 3000,
          netBalance: -3000,
        },
      ],
    };

    it('should save report successfully', async () => {
      const savedReport = {
        _id: reportId,
        ...reportData,
        save: jest.fn().mockResolvedValue(true),
      };

      mockReport.mockImplementation(() => savedReport);

      const result = await saveReport(reportData);

      expect(mockReport).toHaveBeenCalledWith(reportData);
      expect(savedReport.save).toHaveBeenCalled();
      expect(result).toBe(savedReport);
    });
  });

  describe('getReportFromToDate', () => {
    const mockTransactions = [
      {
        _id: 'transaction1',
        userId,
        amount: 5000,
        type: 'income',
        categoryName: 'Salary',
        date: new Date('2023-01-01'),
      },
      {
        _id: 'transaction2',
        userId,
        amount: 1500,
        type: 'expense',
        categoryName: 'Food',
        date: new Date('2023-01-15'),
      },
      {
        _id: 'transaction3',
        userId,
        amount: 500,
        type: 'expense',
        categoryName: 'Transport',
        date: new Date('2023-01-20'),
      },
    ];

    it('should generate report successfully with mixed transactions', async () => {
      mockTransaction.find.mockResolvedValue(mockTransactions);

      const result = await getReportFromToDate(userId, mockDate, mockToDate);

      expect(mockTransaction.find).toHaveBeenCalledWith({
        userId,
        date: {
          $gte: mockDate,
          $lt: mockToDate,
        },
      });

      expect(result).toEqual({
        userId,
        dateFrom: mockDate,
        dateTo: mockToDate,
        totalIncome: 5000,
        totalExpenses: 2000,
        netBalance: 3000,
        byCategory: {
          income: { Salary: 5000 },
          expense: { Food: 1500, Transport: 500 },
        },
        dailyBreakdown: {
          '2023-01-01': { income: 5000, expense: 0, netBalance: 5000 },
          '2023-01-15': { income: 0, expense: 1500, netBalance: -1500 },
          '2023-01-20': { income: 0, expense: 500, netBalance: -500 },
        },
      });
    });

    it('should generate report with only income transactions', async () => {
      const incomeOnlyTransactions = [
        {
          _id: 'transaction1',
          userId,
          amount: 3000,
          type: 'income',
          categoryName: 'Salary',
          date: new Date('2023-01-01'),
        },
        {
          _id: 'transaction2',
          userId,
          amount: 2000,
          type: 'income',
          categoryName: 'Freelance',
          date: new Date('2023-01-15'),
        },
      ];

      mockTransaction.find.mockResolvedValue(incomeOnlyTransactions);

      const result = await getReportFromToDate(userId, mockDate, mockToDate);

      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpenses).toBe(0);
      expect(result.netBalance).toBe(5000);
      expect(result.byCategory.income).toEqual({
        Salary: 3000,
        Freelance: 2000,
      });
      expect(result.byCategory.expense).toEqual({});
    });

    it('should generate report with only expense transactions', async () => {
      const expenseOnlyTransactions = [
        {
          _id: 'transaction1',
          userId,
          amount: 1000,
          type: 'expense',
          categoryName: 'Food',
          date: new Date('2023-01-01'),
        },
        {
          _id: 'transaction2',
          userId,
          amount: 800,
          type: 'expense',
          categoryName: 'Transport',
          date: new Date('2023-01-15'),
        },
      ];

      mockTransaction.find.mockResolvedValue(expenseOnlyTransactions);

      const result = await getReportFromToDate(userId, mockDate, mockToDate);

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(1800);
      expect(result.netBalance).toBe(-1800);
      expect(result.byCategory.income).toEqual({});
      expect(result.byCategory.expense).toEqual({
        Food: 1000,
        Transport: 800,
      });
    });

    it('should handle transactions without categoryName (uncategorized)', async () => {
      const uncategorizedTransactions = [
        {
          _id: 'transaction1',
          userId,
          amount: 1000,
          type: 'income',
          categoryName: null,
          date: new Date('2023-01-01'),
        },
        {
          _id: 'transaction2',
          userId,
          amount: 500,
          type: 'expense',
          categoryName: undefined,
          date: new Date('2023-01-15'),
        },
      ];

      mockTransaction.find.mockResolvedValue(uncategorizedTransactions);

      const result = await getReportFromToDate(userId, mockDate, mockToDate);

      expect(result.byCategory.income).toEqual({ Uncategorized: 1000 });
      expect(result.byCategory.expense).toEqual({ Uncategorized: 500 });
    });

    it('should return empty report when no transactions found', async () => {
      mockTransaction.find.mockResolvedValue([]);

      const result = await getReportFromToDate(userId, mockDate, mockToDate);

      expect(result).toEqual({
        userId,
        dateFrom: mockDate,
        dateTo: mockToDate,
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        byCategory: { income: {}, expense: {} },
        dailyBreakdown: {},
      });
    });

    it('should aggregate multiple transactions in same category', async () => {
      const multipleTransactions = [
        {
          _id: 'transaction1',
          userId,
          amount: 1000,
          type: 'expense',
          categoryName: 'Food',
          date: new Date('2023-01-01'),
        },
        {
          _id: 'transaction2',
          userId,
          amount: 800,
          type: 'expense',
          categoryName: 'Food',
          date: new Date('2023-01-15'),
        },
        {
          _id: 'transaction3',
          userId,
          amount: 1200,
          type: 'expense',
          categoryName: 'Food',
          date: new Date('2023-01-20'),
        },
      ];

      mockTransaction.find.mockResolvedValue(multipleTransactions);

      const result = await getReportFromToDate(userId, mockDate, mockToDate);

      expect(result.byCategory.expense.Food).toBe(3000);
      expect(result.totalExpenses).toBe(3000);
    });
  });

  describe('getLastMonthReport', () => {
    it('should generate last month report successfully', async () => {
      const mockTransactions = [
        {
          _id: 'transaction1',
          userId,
          amount: 3000,
          type: 'income',
          categoryName: 'Salary',
          date: new Date('2023-01-15'),
        },
      ];

      mockTransaction.find.mockResolvedValue(mockTransactions);

      const result = await getLastMonthReport(userId);

      const expectedFromDate = new Date('2023-01-01T00:00:00.000Z');

      expect(mockTransaction.find).toHaveBeenCalledWith({
        userId,
        date: {
          $gte: expectedFromDate,
          $lt: new Date('2023-02-15'),
        },
      });

      expect(result.totalIncome).toBe(3000);
      expect(result.userId).toBe(userId);
    });
  });

  describe('getAllReports', () => {
    const mockReports = [
      {
        _id: 'report1',
        userId,
        dateFrom: new Date('2023-02-01'),
        dateTo: new Date('2023-02-28'),
        totalIncome: 4000,
        totalExpenses: 2000,
      },
      {
        _id: 'report2',
        userId,
        dateFrom: new Date('2023-01-01'),
        dateTo: new Date('2023-01-31'),
        totalIncome: 5000,
        totalExpenses: 3000,
      },
    ];

    it('should get all reports for user successfully', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockReports),
      };
      mockReport.find.mockReturnValue(mockQuery);

      const result = await getAllReports(userId);

      expect(mockReport.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.sort).toHaveBeenCalledWith({ dateFrom: -1 });
      expect(result).toBe(mockReports);
    });

    it('should return empty array if no reports found', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([]),
      };
      mockReport.find.mockReturnValue(mockQuery);

      const result = await getAllReports(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getReportById', () => {
    const mockReportDoc = {
      _id: reportId,
      userId,
      dateFrom: mockDate,
      dateTo: mockToDate,
      totalIncome: 5000,
      totalExpenses: 3000,
    };

    it('should get report by id successfully', async () => {
      mockReport.findOne.mockResolvedValue(mockReportDoc);

      const result = await getReportById(reportId, userId);

      expect(mockReport.findOne).toHaveBeenCalledWith({
        _id: reportId,
        userId,
      });
      expect(result).toBe(mockReportDoc);
    });

    it('should return null if report not found', async () => {
      mockReport.findOne.mockResolvedValue(null);

      const result = await getReportById(reportId, userId);

      expect(result).toBeNull();
    });

    it('should return null if report belongs to different user', async () => {
      mockReport.findOne.mockResolvedValue(null);

      const result = await getReportById(reportId, otherUserId);

      expect(mockReport.findOne).toHaveBeenCalledWith({
        _id: reportId,
        userId: otherUserId,
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteReport', () => {
    const mockReportDoc = {
      _id: reportId,
      userId,
      dateFrom: mockDate,
      dateTo: mockToDate,
      totalIncome: 5000,
      totalExpenses: 3000,
    };

    it('should delete report successfully', async () => {
      mockReport.findOne.mockResolvedValue(mockReportDoc);
      mockReport.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await deleteReport(reportId, userId);

      expect(mockReport.findOne).toHaveBeenCalledWith({
        _id: reportId,
        userId,
      });
      expect(mockReport.deleteOne).toHaveBeenCalledWith({ _id: reportId });
      expect(result).toBe(mockReportDoc);
    });

    it('should throw error if report not found', async () => {
      mockReport.findOne.mockResolvedValue(null);

      await expect(deleteReport(reportId, userId)).rejects.toThrow(
        'Report not found',
      );
      expect(mockReport.deleteOne).not.toHaveBeenCalled();
    });

    it('should throw error if user tries to delete other user report', async () => {
      mockReport.findOne.mockResolvedValue(null);

      await expect(deleteReport(reportId, otherUserId)).rejects.toThrow(
        'Report not found',
      );
      expect(mockReport.deleteOne).not.toHaveBeenCalled();
    });
  });
});
