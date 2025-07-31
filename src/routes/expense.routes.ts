import express from 'express';
import * as expenseController from '../controllers/expense.controller';
import { validate } from '../middlewares/validate';

const router = express.Router();

export default router;
