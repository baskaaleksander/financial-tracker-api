import {
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeById,
  getIncomesByUserId,
} from '../../src/services/income.service';
import Income from '../../src/models/income.model';
import Category from '../../src/models/category.model';

jest.mock('../../src/models/income.model');
jest.mock('../../src/models/category.model');
jest.mock('../../src/validators/transaction.validator');

const mockIncome = Income as jest.MockedFunction<any>;
const mockCategory = Category as jest.MockedFunction<any>;

mockIncome.findById = jest.fn();
mockIncome.find = jest.fn();
mockCategory.findOne = jest.fn();

describe('Income Service', () => {
  const userId = 'userId123';
  const incomeId = 'incomeId123';
  const categoryId = 'categoryId123';
  const otherUserId = 'otherUserId456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createIncome', () => {
    const incomeData = {
      amount: 5000,
      description: 'Salary payment',
      category: 'Salary',
      date: new Date('2023-01-01').toDateString(),
    };

    it('should create income successfully', async () => {
      const mockCategoryDoc = {
        _id: categoryId,
        name: 'Salary',
        userId,
      };

      const savedIncome = {
        _id: incomeId,
        amount: incomeData.amount,
        description: incomeData.description,
        categoryName: incomeData.category,
        categoryId: categoryId,
        userId,
        save: jest.fn().mockResolvedValue(true),
      };

      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);
      mockIncome.mockImplementation(() => savedIncome);

      const result = await createIncome(incomeData, userId);

      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: incomeData.category,
        userId,
      });
      expect(mockIncome).toHaveBeenCalledWith({
        amount: incomeData.amount,
        description: incomeData.description,
        categoryName: incomeData.category,
        categoryId: categoryId,
        userId,
      });
      expect(savedIncome.save).toHaveBeenCalled();
      expect(result).toBe(savedIncome);
    });

    it('should throw error if category not found', async () => {
      mockCategory.findOne.mockResolvedValue(null);

      await expect(createIncome(incomeData, userId)).rejects.toThrow(
        'Category not found',
      );
      expect(mockIncome).not.toHaveBeenCalled();
    });
  });

  describe('updateIncome', () => {
    const updateData = {
      amount: 5500,
      description: 'Updated salary payment',
      category: 'Updated Salary',
    };

    const mockIncomeDoc = {
      _id: incomeId,
      amount: 5000,
      description: 'Salary payment',
      categoryName: 'Salary',
      categoryId: categoryId,
      userId: { toString: () => userId },
      save: jest.fn().mockResolvedValue(true),
    };

    it('should update income successfully', async () => {
      const mockCategoryDoc = {
        _id: 'newCategoryId123',
        name: 'Updated Salary',
        userId,
      };

      mockIncome.findById.mockResolvedValue(mockIncomeDoc);
      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);

      const result = await updateIncome(incomeId, updateData, userId);

      expect(mockIncome.findById).toHaveBeenCalledWith(incomeId);
      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: updateData.category,
        userId,
      });
      expect(mockIncomeDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockIncomeDoc);
      expect(mockIncomeDoc.amount).toBe(updateData.amount);
      expect(mockIncomeDoc.description).toBe(updateData.description);
      expect(mockIncomeDoc.categoryName).toBe(updateData.category);
    });

    it('should throw error if income not found', async () => {
      mockIncome.findById.mockResolvedValue(null);

      await expect(updateIncome(incomeId, updateData, userId)).rejects.toThrow(
        'Income not found',
      );
    });

    it('should throw error if user tries to update other user income', async () => {
      const incomeWithDifferentUser = {
        ...mockIncomeDoc,
        userId: { toString: () => otherUserId },
      };
      mockIncome.findById.mockResolvedValue(incomeWithDifferentUser);

      await expect(updateIncome(incomeId, updateData, userId)).rejects.toThrow(
        'You can only update your own incomes',
      );
    });

    it('should throw error if category not found when updating category', async () => {
      mockIncome.findById.mockResolvedValue(mockIncomeDoc);
      mockCategory.findOne.mockResolvedValue(null);

      await expect(updateIncome(incomeId, updateData, userId)).rejects.toThrow(
        'Category not found',
      );
    });

    it('should update income without changing category when category not provided', async () => {
      const updateDataWithoutCategory = {
        amount: 5500,
        description: 'Updated salary payment',
      };

      mockIncome.findById.mockResolvedValue(mockIncomeDoc);

      const result = await updateIncome(
        incomeId,
        updateDataWithoutCategory,
        userId,
      );

      expect(mockIncomeDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockIncomeDoc);
      expect(mockIncomeDoc.amount).toBe(updateDataWithoutCategory.amount);
      expect(mockIncomeDoc.description).toBe(
        updateDataWithoutCategory.description,
      );
    });
  });

  describe('deleteIncome', () => {
    const mockIncomeDoc = {
      _id: incomeId,
      amount: 5000,
      description: 'Salary payment',
      userId: { toString: () => userId },
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    it('should delete income successfully', async () => {
      mockIncome.findById.mockResolvedValue(mockIncomeDoc);

      const result = await deleteIncome(incomeId, userId);

      expect(mockIncome.findById).toHaveBeenCalledWith(incomeId);
      expect(mockIncomeDoc.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Income deleted successfully' });
    });

    it('should throw error if income not found', async () => {
      mockIncome.findById.mockResolvedValue(null);

      await expect(deleteIncome(incomeId, userId)).rejects.toThrow(
        'Income not found',
      );
    });

    it('should throw error if user tries to delete other user income', async () => {
      const incomeWithDifferentUser = {
        ...mockIncomeDoc,
        userId: { toString: () => otherUserId },
      };
      mockIncome.findById.mockResolvedValue(incomeWithDifferentUser);

      await expect(deleteIncome(incomeId, userId)).rejects.toThrow(
        'You can only delete your own incomes',
      );
    });
  });

  describe('getIncomeById', () => {
    const mockIncomeDoc = {
      _id: incomeId,
      amount: 5000,
      description: 'Salary payment',
      userId: { toString: () => userId },
    };

    it('should get income by id successfully', async () => {
      mockIncome.findById.mockResolvedValue(mockIncomeDoc);

      const result = await getIncomeById(incomeId, userId);

      expect(mockIncome.findById).toHaveBeenCalledWith(incomeId);
      expect(result).toBe(mockIncomeDoc);
    });

    it('should throw error if income not found', async () => {
      mockIncome.findById.mockResolvedValue(null);

      await expect(getIncomeById(incomeId, userId)).rejects.toThrow(
        'Income not found',
      );
    });

    it('should throw error if user tries to view other user income', async () => {
      const incomeWithDifferentUser = {
        ...mockIncomeDoc,
        userId: { toString: () => otherUserId },
      };
      mockIncome.findById.mockResolvedValue(incomeWithDifferentUser);

      await expect(getIncomeById(incomeId, userId)).rejects.toThrow(
        'You can only view your own incomes',
      );
    });
  });

  describe('getIncomesByUserId', () => {
    const mockIncomes = [
      {
        _id: 'income1',
        amount: 5000,
        description: 'Salary payment',
        userId,
      },
      {
        _id: 'income2',
        amount: 500,
        description: 'Freelance work',
        userId,
      },
    ];

    it('should get all incomes for user successfully', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockIncomes),
      };
      mockIncome.find.mockReturnValue(mockQuery);

      const result = await getIncomesByUserId(userId);

      expect(mockIncome.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.populate).toHaveBeenCalledWith('userId');
      expect(result).toBe(mockIncomes);
    });

    it('should return empty array if no incomes found', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue([]),
      };
      mockIncome.find.mockReturnValue(mockQuery);

      const result = await getIncomesByUserId(userId);

      expect(mockIncome.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.populate).toHaveBeenCalledWith('userId');
      expect(result).toEqual([]);
    });
  });
});
