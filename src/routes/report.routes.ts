import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as reportController from '../controllers/report.controller';
import { validate } from '../middlewares/validate';
import { saveReportSchema } from '../validators/report.validator';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Save a report
 *     description: Save a pre-calculated report for the authenticated user.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveReportRequest'
 *     responses:
 *       201:
 *         description: Report saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validate(saveReportSchema), reportController.saveReport);

/**
 * @swagger
 * /api/reports/generate:
 *   get:
 *     summary: Generate report for date range
 *     description: Generate a financial report for the authenticated user within a specified date range.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         description: Start date for the report (ISO format)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *       - in: query
 *         name: toDate
 *         required: true
 *         description: End date for the report (ISO format)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2023-01-31T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneratedReport'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid date parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/generate', reportController.getReportFromToDate);

/**
 * @swagger
 * /api/reports/latest:
 *   get:
 *     summary: Get last month report
 *     description: Generate a financial report for the authenticated user for the last month.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last month report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneratedReport'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/latest', reportController.getLastMonthReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     description: Retrieve a specific saved report owned by the authenticated user.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Report ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found or doesn't belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               statusCode: 404
 *               message: "Report not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', reportController.getReportById);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     description: Delete a specific saved report owned by the authenticated user.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Report ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               statusCode: 404
 *               message: "Report not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', reportController.deleteReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports
 *     description: Retrieve all saved reports owned by the authenticated user, sorted by date (newest first).
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', reportController.getAllReports);

export default router;
