import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
  getExpensesByUserId,
} from '../../src/services/expense.service';
import Expense from '../../src/models/expense.model';

jest.mock('../../src/models/expense.model');
jest.mock('../../src/validators/expense.validator');

const mockExpense = Expense as jest.MockedFunction<any>;

mockExpense.findById = jest.fn();
mockExpense.find = jest.fn();

describe('Expense Service', () => {
  const userId = 'userId123';
  const expenseId = 'expenseId123';
  const otherUserId = 'otherUserId456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createExpense', () => {
    const expenseData = {
      amount: 100,
      description: 'Test expense',
      category: 'Food',
      date: new Date('2023-01-01').toDateString(),
    };

    it('should create expense successfully', async () => {
      const savedExpense = {
        _id: expenseId,
        ...expenseData,
        userId,
        save: jest.fn().mockResolvedValue(true),
      };

      mockExpense.mockImplementation(() => savedExpense);

      const result = await createExpense(expenseData, userId);

      expect(mockExpense).toHaveBeenCalledWith({ ...expenseData, userId });
      expect(savedExpense.save).toHaveBeenCalled();
      expect(result).toBe(savedExpense);
    });
  });

  describe('updateExpense', () => {
    const updateData = {
      amount: 150,
      description: 'Updated expense',
    };

    const mockExpenseDoc = {
      _id: expenseId,
      amount: 100,
      description: 'Test expense',
      userId: userId,
      save: jest.fn().mockResolvedValue(true),
    };

    it('should update expense successfully', async () => {
      mockExpenseDoc.userId = { toString: () => userId } as any;
      mockExpense.findById.mockResolvedValue(mockExpenseDoc);

      const result = await updateExpense(expenseId, updateData, userId);

      expect(mockExpense.findById).toHaveBeenCalledWith(expenseId);
      expect(mockExpenseDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockExpenseDoc);
      expect(mockExpenseDoc.amount).toBe(updateData.amount);
      expect(mockExpenseDoc.description).toBe(updateData.description);
    });

    it('should throw error if expense not found', async () => {
      mockExpense.findById.mockResolvedValue(null);

      await expect(
        updateExpense(expenseId, updateData, userId),
      ).rejects.toThrow('Expense not found');
      expect(mockExpenseDoc.save).not.toHaveBeenCalled();
    });

    it('should throw error if user tries to update other user expense', async () => {
      const expenseWithDifferentUser = {
        ...mockExpenseDoc,
        userId: { toString: () => otherUserId },
      };
      mockExpense.findById.mockResolvedValue(expenseWithDifferentUser);

      await expect(
        updateExpense(expenseId, updateData, userId),
      ).rejects.toThrow('You can only update your own expenses');
      expect(mockExpenseDoc.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteExpense', () => {
    const mockExpenseDoc = {
      _id: expenseId,
      amount: 100,
      description: 'Test expense',
      userId: { toString: () => userId },
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    it('should delete expense successfully', async () => {
      mockExpense.findById.mockResolvedValue(mockExpenseDoc);

      const result = await deleteExpense(expenseId, userId);

      expect(mockExpense.findById).toHaveBeenCalledWith(expenseId);
      expect(mockExpenseDoc.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Expense deleted successfully' });
    });

    it('should throw error if expense not found', async () => {
      mockExpense.findById.mockResolvedValue(null);

      await expect(deleteExpense(expenseId, userId)).rejects.toThrow(
        'Expense not found',
      );
      expect(mockExpenseDoc.deleteOne).not.toHaveBeenCalled();
    });

    it('should throw error if user tries to delete other user expense', async () => {
      const expenseWithDifferentUser = {
        ...mockExpenseDoc,
        userId: { toString: () => otherUserId },
      };
      mockExpense.findById.mockResolvedValue(expenseWithDifferentUser);

      await expect(deleteExpense(expenseId, userId)).rejects.toThrow(
        'You can only delete your own expenses',
      );
      expect(mockExpenseDoc.deleteOne).not.toHaveBeenCalled();
    });
  });

  describe('getExpenseById', () => {
    const mockExpenseDoc = {
      _id: expenseId,
      amount: 100,
      description: 'Test expense',
      userId: { toString: () => userId },
    };

    it('should get expense by id successfully', async () => {
      mockExpense.findById.mockResolvedValue(mockExpenseDoc);

      const result = await getExpenseById(expenseId, userId);

      expect(mockExpense.findById).toHaveBeenCalledWith(expenseId);
      expect(result).toBe(mockExpenseDoc);
    });

    it('should throw error if expense not found', async () => {
      mockExpense.findById.mockResolvedValue(null);

      await expect(getExpenseById(expenseId, userId)).rejects.toThrow(
        'Expense not found',
      );
    });

    it('should throw error if user tries to view other user expense', async () => {
      const expenseWithDifferentUser = {
        ...mockExpenseDoc,
        userId: { toString: () => otherUserId },
      };
      mockExpense.findById.mockResolvedValue(expenseWithDifferentUser);

      await expect(getExpenseById(expenseId, userId)).rejects.toThrow(
        'You can only view your own expenses',
      );
    });
  });

  describe('getExpensesByUserId', () => {
    const mockExpenses = [
      {
        _id: 'expense1',
        amount: 100,
        description: 'Expense 1',
        userId,
      },
      {
        _id: 'expense2',
        amount: 200,
        description: 'Expense 2',
        userId,
      },
    ];

    it('should get all expenses for user successfully', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockExpenses),
      };
      mockExpense.find.mockReturnValue(mockQuery);

      const result = await getExpensesByUserId(userId);

      expect(mockExpense.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.populate).toHaveBeenCalledWith('userId');
      expect(result).toBe(mockExpenses);
    });

    it('should return empty array if no expenses found', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue([]),
      };
      mockExpense.find.mockReturnValue(mockQuery);

      const result = await getExpensesByUserId(userId);

      expect(mockExpense.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.populate).toHaveBeenCalledWith('userId');
      expect(result).toEqual([]);
    });
  });
});
