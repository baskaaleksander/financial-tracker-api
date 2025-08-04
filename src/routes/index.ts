import { Router } from 'express';
import authRoutes from './auth.routes';
import categoriesRoutes from './categories.route';
import transactionRoutes from './transaction.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);

export default router;
