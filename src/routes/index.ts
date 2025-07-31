import { Router } from 'express';
import authRoutes from './auth.routes';
import expensesRoutes from './expense.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/expenses', expensesRoutes);

export default router;
