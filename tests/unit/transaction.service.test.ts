import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionsByUserId,
} from '../../src/services/transaction.service';
import Transaction from '../../src/models/transaction.model';
import Category from '../../src/models/category.model';

jest.mock('../../src/models/transaction.model');
jest.mock('../../src/models/category.model');
jest.mock('../../src/validators/transaction.validator');

const mockTransaction = Transaction as jest.MockedFunction<any>;
const mockCategory = Category as jest.MockedFunction<any>;

mockTransaction.findById = jest.fn();
mockTransaction.find = jest.fn();
mockCategory.findOne = jest.fn();

describe('Transaction Service', () => {
  const userId = 'userId123';
  const transactionId = 'transactionId123';
  const categoryId = 'categoryId123';
  const otherUserId = 'otherUserId456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const transactionData = {
      amount: 100,
      type: 'expense' as const,
      description: 'Test transaction',
      category: 'Food',
      date: new Date('2023-01-01').toDateString(),
    };

    it('should create expense transaction successfully', async () => {
      const mockCategoryDoc = {
        _id: categoryId,
        name: 'Food',
        userId,
      };

      const savedTransaction = {
        _id: transactionId,
        amount: transactionData.amount,
        type: transactionData.type,
        description: transactionData.description,
        categoryName: transactionData.category,
        categoryId: categoryId,
        userId,
        save: jest.fn().mockResolvedValue(true),
      };

      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);
      mockTransaction.mockImplementation(() => savedTransaction);

      const result = await createTransaction(transactionData, userId);

      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: transactionData.category,
        userId,
      });
      expect(mockTransaction).toHaveBeenCalledWith({
        amount: transactionData.amount,
        type: transactionData.type,
        description: transactionData.description,
        categoryName: transactionData.category,
        categoryId: categoryId,
        userId,
      });
      expect(savedTransaction.save).toHaveBeenCalled();
      expect(result).toBe(savedTransaction);
    });

    it('should create income transaction successfully', async () => {
      const incomeData = {
        ...transactionData,
        type: 'income' as const,
        description: 'Salary payment',
        category: 'Salary',
      };

      const mockCategoryDoc = {
        _id: categoryId,
        name: 'Salary',
        userId,
      };

      const savedTransaction = {
        _id: transactionId,
        amount: incomeData.amount,
        type: incomeData.type,
        description: incomeData.description,
        categoryName: incomeData.category,
        categoryId: categoryId,
        userId,
        save: jest.fn().mockResolvedValue(true),
      };

      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);
      mockTransaction.mockImplementation(() => savedTransaction);

      const result = await createTransaction(incomeData, userId);

      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: incomeData.category,
        userId,
      });
      expect(savedTransaction.save).toHaveBeenCalled();
      expect(result).toBe(savedTransaction);
    });

    it('should throw error if category not found', async () => {
      mockCategory.findOne.mockResolvedValue(null);

      await expect(createTransaction(transactionData, userId)).rejects.toThrow(
        'Category not found',
      );
      expect(mockTransaction).not.toHaveBeenCalled();
    });
  });

  describe('updateTransaction', () => {
    const updateData = {
      amount: 150,
      description: 'Updated transaction',
      category: 'Updated Food',
      date: '2023-02-01',
    };

    const mockTransactionDoc = {
      _id: transactionId,
      amount: 100,
      type: 'expense',
      description: 'Test transaction',
      categoryName: 'Food',
      categoryId: categoryId,
      date: new Date('2023-01-01'),
      userId: { toString: () => userId },
      save: jest.fn().mockResolvedValue(true),
    };

    it('should update transaction successfully', async () => {
      const mockCategoryDoc = {
        _id: 'newCategoryId123',
        name: 'Updated Food',
        userId,
      };

      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);
      mockCategory.findOne.mockResolvedValue(mockCategoryDoc);

      const result = await updateTransaction(transactionId, updateData, userId);

      expect(mockTransaction.findById).toHaveBeenCalledWith(transactionId);
      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: updateData.category,
        userId,
      });
      expect(mockTransactionDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockTransactionDoc);
      expect(mockTransactionDoc.amount).toBe(updateData.amount);
      expect(mockTransactionDoc.description).toBe(updateData.description);
      expect(mockTransactionDoc.categoryName).toBe(updateData.category);
      expect(mockTransactionDoc.categoryId).toBe('newCategoryId123');
    });

    it('should update transaction without changing category when category not provided', async () => {
      const updateDataWithoutCategory = {
        amount: 150,
        description: 'Updated transaction',
        date: '2023-02-01',
      };

      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);

      const result = await updateTransaction(
        transactionId,
        updateDataWithoutCategory,
        userId,
      );

      expect(mockTransactionDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockTransactionDoc);
      expect(mockTransactionDoc.amount).toBe(updateDataWithoutCategory.amount);
      expect(mockTransactionDoc.description).toBe(
        updateDataWithoutCategory.description,
      );
    });

    it('should update only provided fields and keep others unchanged', async () => {
      const partialUpdateData = {
        amount: 200,
      };

      const originalAmount = mockTransactionDoc.amount;
      const originalDescription = mockTransactionDoc.description;

      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);

      const result = await updateTransaction(
        transactionId,
        partialUpdateData,
        userId,
      );

      expect(mockTransactionDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockTransactionDoc);
      expect(mockTransactionDoc.amount).toBe(partialUpdateData.amount);
      expect(mockTransactionDoc.description).toBe(originalDescription);
    });

    it('should throw error if transaction not found', async () => {
      mockTransaction.findById.mockResolvedValue(null);

      await expect(
        updateTransaction(transactionId, updateData, userId),
      ).rejects.toThrow('Transaction not found');
    });

    it('should throw error if user tries to update other user transaction', async () => {
      const transactionWithDifferentUser = {
        ...mockTransactionDoc,
        userId: { toString: () => otherUserId },
      };
      mockTransaction.findById.mockResolvedValue(transactionWithDifferentUser);

      await expect(
        updateTransaction(transactionId, updateData, userId),
      ).rejects.toThrow('You can only update your own transactions');
    });

    it('should throw error if category not found when updating category', async () => {
      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);
      mockCategory.findOne.mockResolvedValue(null);

      await expect(
        updateTransaction(transactionId, updateData, userId),
      ).rejects.toThrow('Category not found');
    });

    it('should handle date update correctly', async () => {
      const updateDataWithDate = {
        amount: 150,
        date: '2023-03-01',
      };

      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);

      await updateTransaction(transactionId, updateDataWithDate, userId);

      expect(mockTransactionDoc.date).toEqual(new Date('2023-03-01'));
    });
  });

  describe('deleteTransaction', () => {
    const mockTransactionDoc = {
      _id: transactionId,
      amount: 100,
      type: 'expense',
      description: 'Test transaction',
      userId: { toString: () => userId },
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    it('should delete transaction successfully', async () => {
      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);

      const result = await deleteTransaction(transactionId, userId);

      expect(mockTransaction.findById).toHaveBeenCalledWith(transactionId);
      expect(mockTransactionDoc.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Transaction deleted successfully' });
    });

    it('should throw error if transaction not found', async () => {
      mockTransaction.findById.mockResolvedValue(null);

      await expect(deleteTransaction(transactionId, userId)).rejects.toThrow(
        'Transaction not found',
      );
    });

    it('should throw error if user tries to delete other user transaction', async () => {
      const transactionWithDifferentUser = {
        ...mockTransactionDoc,
        userId: { toString: () => otherUserId },
      };
      mockTransaction.findById.mockResolvedValue(transactionWithDifferentUser);

      await expect(deleteTransaction(transactionId, userId)).rejects.toThrow(
        'You can only delete your own transactions',
      );
    });
  });

  describe('getTransactionById', () => {
    const mockTransactionDoc = {
      _id: transactionId,
      amount: 100,
      type: 'expense',
      description: 'Test transaction',
      userId: { toString: () => userId },
    };

    it('should get transaction by id successfully', async () => {
      mockTransaction.findById.mockResolvedValue(mockTransactionDoc);

      const result = await getTransactionById(transactionId, userId);

      expect(mockTransaction.findById).toHaveBeenCalledWith(transactionId);
      expect(result).toBe(mockTransactionDoc);
    });

    it('should throw error if transaction not found', async () => {
      mockTransaction.findById.mockResolvedValue(null);

      await expect(getTransactionById(transactionId, userId)).rejects.toThrow(
        'Transaction not found',
      );
    });

    it('should throw error if user tries to view other user transaction', async () => {
      const transactionWithDifferentUser = {
        ...mockTransactionDoc,
        userId: { toString: () => otherUserId },
      };
      mockTransaction.findById.mockResolvedValue(transactionWithDifferentUser);

      await expect(getTransactionById(transactionId, userId)).rejects.toThrow(
        'You can only view your own transactions',
      );
    });
  });

  describe('getTransactionsByUserId', () => {
    const mockTransactions = [
      {
        _id: 'transaction1',
        amount: 100,
        type: 'expense',
        description: 'Transaction 1',
        userId,
      },
      {
        _id: 'transaction2',
        amount: 500,
        type: 'income',
        description: 'Transaction 2',
        userId,
      },
    ];

    it('should get all transactions for user successfully', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockTransactions),
      };
      mockTransaction.find.mockReturnValue(mockQuery);

      const result = await getTransactionsByUserId(userId);

      expect(mockTransaction.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.populate).toHaveBeenCalledWith('userId');
      expect(result).toBe(mockTransactions);
    });

    it('should return empty array if no transactions found', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue([]),
      };
      mockTransaction.find.mockReturnValue(mockQuery);

      const result = await getTransactionsByUserId(userId);

      expect(mockTransaction.find).toHaveBeenCalledWith({ userId });
      expect(mockQuery.populate).toHaveBeenCalledWith('userId');
      expect(result).toEqual([]);
    });

    it('should handle mixed transaction types', async () => {
      const mixedTransactions = [
        {
          _id: 'expense1',
          amount: 50,
          type: 'expense',
          description: 'Coffee',
          userId,
        },
        {
          _id: 'income1',
          amount: 1000,
          type: 'income',
          description: 'Salary',
          userId,
        },
        {
          _id: 'expense2',
          amount: 200,
          type: 'expense',
          description: 'Groceries',
          userId,
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mixedTransactions),
      };
      mockTransaction.find.mockReturnValue(mockQuery);

      const result = await getTransactionsByUserId(userId);

      expect(result).toBe(mixedTransactions);
      expect(result).toHaveLength(3);
    });
  });
});
