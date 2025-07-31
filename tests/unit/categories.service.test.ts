import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByUserId,
  getCategoryById,
} from '../../src/services/categories.service';
import Category from '../../src/models/category.model';

jest.mock('../../src/models/category.model');
jest.mock('../../src/validators/category.validator');

const mockCategory = Category as jest.MockedFunction<any>;

mockCategory.findOne = jest.fn();
mockCategory.findById = jest.fn();
mockCategory.find = jest.fn();

describe('Categories Service', () => {
  const userId = 'userId123';
  const categoryId = 'categoryId123';
  const otherUserId = 'otherUserId456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    const categoryData = {
      name: 'Food',
      description: 'Food expenses',
      color: '#FF5733',
      userId,
    };

    it('should create category successfully', async () => {
      const savedCategory = {
        _id: categoryId,
        name: categoryData.name,
        description: categoryData.description,
        color: categoryData.color,
        userId,
        save: jest.fn().mockResolvedValue(true),
      };

      mockCategory.findOne.mockResolvedValue(null);
      mockCategory.mockImplementation(() => savedCategory);

      const result = await createCategory(categoryData, userId);

      expect(mockCategory.findOne).toHaveBeenCalledWith({
        name: categoryData.name,
        userId,
      });
      expect(mockCategory).toHaveBeenCalledWith(categoryData);
      expect(savedCategory.save).toHaveBeenCalled();
      expect(result).toBe(savedCategory);
    });

    it('should throw error if category already exists', async () => {
      const existingCategory = {
        _id: categoryId,
        name: categoryData.name,
        userId,
      };

      mockCategory.findOne.mockResolvedValue(existingCategory);

      await expect(createCategory(categoryData, userId)).rejects.toThrow(
        'Category already exists',
      );
      expect(mockCategory).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    const updateData = {
      name: 'Updated Food',
      description: 'Updated food expenses',
      color: '#33FF57',
    };

    const mockCategoryDoc = {
      _id: categoryId,
      name: 'Food',
      description: 'Food expenses',
      color: '#FF5733',
      userId: { toString: () => userId },
      save: jest.fn().mockResolvedValue(true),
    };

    it('should update category successfully', async () => {
      mockCategory.findById.mockResolvedValue(mockCategoryDoc);

      const result = await updateCategory(categoryId, updateData, userId);

      expect(mockCategory.findById).toHaveBeenCalledWith(categoryId);
      expect(mockCategoryDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockCategoryDoc);
      expect(mockCategoryDoc.name).toBe(updateData.name);
      expect(mockCategoryDoc.description).toBe(updateData.description);
      expect(mockCategoryDoc.color).toBe(updateData.color);
    });

    it('should throw error if category not found', async () => {
      mockCategory.findById.mockResolvedValue(null);

      await expect(
        updateCategory(categoryId, updateData, userId),
      ).rejects.toThrow('Category not found');
      expect(mockCategoryDoc.save).not.toHaveBeenCalled();
    });

    it('should throw error if user tries to update other user category', async () => {
      const categoryWithDifferentUser = {
        ...mockCategoryDoc,
        userId: { toString: () => otherUserId },
      };
      mockCategory.findById.mockResolvedValue(categoryWithDifferentUser);

      await expect(
        updateCategory(categoryId, updateData, userId),
      ).rejects.toThrow('You can only update your own categories');
      expect(mockCategoryDoc.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    const mockCategoryDoc = {
      _id: categoryId,
      name: 'Food',
      description: 'Food expenses',
      userId: { toString: () => userId },
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    it('should delete category successfully', async () => {
      mockCategory.findById.mockResolvedValue(mockCategoryDoc);

      const result = await deleteCategory(categoryId, userId);

      expect(mockCategory.findById).toHaveBeenCalledWith(categoryId);
      expect(mockCategoryDoc.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should throw error if category not found', async () => {
      mockCategory.findById.mockResolvedValue(null);

      await expect(deleteCategory(categoryId, userId)).rejects.toThrow(
        'Category not found',
      );
    });

    it('should throw error if user tries to delete other user category', async () => {
      const categoryWithDifferentUser = {
        ...mockCategoryDoc,
        userId: { toString: () => otherUserId },
      };
      mockCategory.findById.mockResolvedValue(categoryWithDifferentUser);

      await expect(deleteCategory(categoryId, userId)).rejects.toThrow(
        'You can only delete your own categories',
      );
      expect(mockCategoryDoc.deleteOne).not.toHaveBeenCalled();
    });
  });

  describe('getCategoriesByUserId', () => {
    const mockCategories = [
      {
        _id: 'category1',
        name: 'Food',
        description: 'Food expenses',
        userId,
      },
      {
        _id: 'category2',
        name: 'Transport',
        description: 'Transport expenses',
        userId,
      },
    ];

    it('should get all categories for user successfully', async () => {
      mockCategory.find.mockResolvedValue(mockCategories);

      const result = await getCategoriesByUserId(userId);

      expect(mockCategory.find).toHaveBeenCalledWith({ userId });
      expect(result).toBe(mockCategories);
    });

    it('should return empty array if no categories found', async () => {
      mockCategory.find.mockResolvedValue([]);

      const result = await getCategoriesByUserId(userId);

      expect(mockCategory.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual([]);
    });
  });

  describe('getCategoryById', () => {
    const mockCategoryDoc = {
      _id: categoryId,
      name: 'Food',
      description: 'Food expenses',
      userId: { toString: () => userId },
    };

    it('should get category by id successfully', async () => {
      mockCategory.findById.mockResolvedValue(mockCategoryDoc);

      const result = await getCategoryById(categoryId, userId);

      expect(mockCategory.findById).toHaveBeenCalledWith(categoryId);
      expect(result).toBe(mockCategoryDoc);
    });

    it('should throw error if category not found', async () => {
      mockCategory.findById.mockResolvedValue(null);

      await expect(getCategoryById(categoryId, userId)).rejects.toThrow(
        'Category not found',
      );
    });

    it('should throw error if user tries to access other user category', async () => {
      const categoryWithDifferentUser = {
        ...mockCategoryDoc,
        userId: { toString: () => otherUserId },
      };
      mockCategory.findById.mockResolvedValue(categoryWithDifferentUser);

      await expect(getCategoryById(categoryId, userId)).rejects.toThrow(
        'You can only access your own categories',
      );
    });
  });
});
