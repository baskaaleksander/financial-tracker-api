import * as reportService from '../services/report.service';
import { NextFunction, Request, Response } from 'express';

export const saveReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reportData = req.body;
    const userId = req.user?.userId;

    const reportDataWithUserId = { ...reportData, userId };

    const newReport = await reportService.saveReport(reportDataWithUserId);
    res.status(201).json(newReport);
  } catch (error) {
    next(error);
  }
};

export const getReportFromToDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const fromDate = new Date(req.query.fromDate as string);
    const toDate = new Date(req.query.toDate as string);

    const report = await reportService.getReportFromToDate(
      userId,
      fromDate,
      toDate,
    );
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const getLastMonthReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    const report = await reportService.getLastMonthReport(userId);
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    const reports = await reportService.getAllReports(userId);
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reportId = req.params.id;
    const userId = req.user?.userId;

    const report = await reportService.getReportById(reportId, userId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reportId = req.params.id;
    const userId = req.user?.userId;

    await reportService.deleteReport(reportId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
