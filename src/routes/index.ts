import { Router } from 'express';
import authRoutes from './auth.routes';
import expensesRoutes from './expense.routes';
import categoriesRoutes from './categories.route';
import incomeRoutes from './income.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/expenses', expensesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/incomes', incomeRoutes);

export default router;
