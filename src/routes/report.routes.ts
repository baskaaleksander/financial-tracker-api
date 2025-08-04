import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as reportController from '../controllers/report.controller';
import { validate } from '../middlewares/validate';
import { saveReportSchema } from '../validators/report.validator';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(saveReportSchema), reportController.saveReport);

router.get('/:id', reportController.getReportById);

router.get('/generate', reportController.getReportFromToDate);

router.get('/latest', reportController.getLastMonthReport);

router.get('/', reportController.getAllReports);

router.delete('/:id', reportController.deleteReport);

export default router;
