import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoriesRoutes from './categories.route.js';
import transactionRoutes from './transaction.routes.js';
import reportRoutes from './report.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);

export default router;
