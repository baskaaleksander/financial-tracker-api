import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
  getExpensesByUserId,
} from '../../src/services/expense.service';
import Expense from '../../src/models/expense.model';
import Category from '../../src/models/category.model';

jest.mock('../../src/models/expense.model');
jest.mock('../../src/models/category.model');
jest.mock('../../src/validators/transaction.validator');

const mockExpense = Expense as jest.MockedFunction<any>;
const mockCategory = Category as jest.MockedFunction<any>;

mockExpense.findById = jest.fn();
mockExpense.find = jest.fn();
mockCategory.findOne = jest.fn();

describe('Expense Service', () => {
  const userId = 'userId123';
  const expenseId = 'expenseId123';
  const categoryId = 'categoryId123';
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
      const mockCategoryDoc = {
        _id: categoryId,
        name: 'Food',
        userId,
      };

      const savedExpense = {
        _id: expenseId,
        amount: expenseData.amount,
        description: expenseData.description,
        categoryName: expenseData.category,
        categoryId: categoryId,
        userId,
        save: jest.fn().mockResolvedValue(true),
      };

      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);
      mockExpense.mockImplementation(() => savedExpense);

      const result = await createExpense(expenseData, userId);

      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: expenseData.category,
        userId,
      });
      expect(mockExpense).toHaveBeenCalledWith({
        amount: expenseData.amount,
        description: expenseData.description,
        categoryName: expenseData.category,
        categoryId: categoryId,
        userId,
      });
      expect(savedExpense.save).toHaveBeenCalled();
      expect(result).toBe(savedExpense);
    });

    it('should throw error if category not found', async () => {
      mockCategory.findOne.mockResolvedValue(null);

      await expect(createExpense(expenseData, userId)).rejects.toThrow(
        'Category not found',
      );
      expect(mockExpense).not.toHaveBeenCalled();
    });
  });

  describe('updateExpense', () => {
    const updateData = {
      amount: 150,
      description: 'Updated expense',
      category: 'Updated Food',
    };

    const mockExpenseDoc = {
      _id: expenseId,
      amount: 100,
      description: 'Test expense',
      categoryName: 'Food',
      categoryId: categoryId,
      userId: { toString: () => userId },
      save: jest.fn().mockResolvedValue(true),
    };

    it('should update expense successfully', async () => {
      const mockCategoryDoc = {
        _id: 'newCategoryId123',
        name: 'Updated Food',
        userId,
      };

      mockExpense.findById.mockResolvedValue(mockExpenseDoc);
      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);

      const result = await updateExpense(expenseId, updateData, userId);

      expect(mockExpense.findById).toHaveBeenCalledWith(expenseId);
      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: updateData.category,
        userId,
      });
      expect(result).toBe(mockExpenseDoc);
      expect(mockExpenseDoc.amount).toBe(updateData.amount);
      expect(mockExpenseDoc.description).toBe(updateData.description);
      expect(mockExpenseDoc.categoryName).toBe(updateData.category);
    });

    it('should throw error if expense not found', async () => {
      mockExpense.findById.mockResolvedValue(null);

      await expect(
        updateExpense(expenseId, updateData, userId),
      ).rejects.toThrow('Expense not found');
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
    });

    it('should throw error if category not found when updating category', async () => {
      mockExpense.findById.mockResolvedValue(mockExpenseDoc);
      mockCategory.findOne.mockResolvedValue(null);

      await expect(
        updateExpense(expenseId, updateData, userId),
      ).rejects.toThrow('Category not found');
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
