import { Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { FinancialYearService } from './financialYear.service.js';

const getFinancialYears = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params['companyId'] as string;
  const result = await FinancialYearService.getFinancialYears(companyId, req.user!.userId, req.user!.role);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Financial years retrieved', data: result });
});

const createFinancialYear = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params['companyId'] as string;
  const result = await FinancialYearService.createFinancialYear(companyId, req.body.reportingDate, req.user!.userId);
  sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: 'Financial year created', data: result });
});

const deleteFinancialYear = catchAsync(async (req: Request, res: Response) => {
  const yearId = req.params['yearId'] as string;
  const result = await FinancialYearService.deleteFinancialYear(yearId, req.user!.userId, req.user!.role);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Financial year deleted', data: result });
});

const assignFinancialYear = catchAsync(async (req: Request, res: Response) => {
  const yearId = req.params['yearId'] as string;
  const result = await FinancialYearService.assignFinancialYear(yearId, req.body.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Financial year assigned', data: result });
});

const submitYear = catchAsync(async (req: Request, res: Response) => {
  const yearId = req.params['yearId'] as string;
  const result = await FinancialYearService.submitFinancialYear(yearId, req.user!.userId, req.body.note);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Financial year submitted for review', data: result });
});

const reviewAction = catchAsync(async (req: Request, res: Response) => {
  const { action, note } = req.body as { action: string; note?: string };
  const yearId = req.params['yearId'] as string;
  const userId = req.user!.userId;

  let result;
  if (action === 'start_review') result = await FinancialYearService.startReview(yearId, userId);
  else if (action === 'request_changes') result = await FinancialYearService.requestChanges(yearId, userId, note);
  else if (action === 'finalize') result = await FinancialYearService.finalizeYear(yearId, userId, note);
  else if (action === 'reopen') result = await FinancialYearService.reopenYear(yearId, userId, note);
  else throw new AppError(status.BAD_REQUEST, `Unknown review action: ${action}`);

  sendResponse(res, { httpStatusCode: status.OK, success: true, message: `Action '${action}' performed`, data: result });
});

export const FinancialYearController = {
  getFinancialYears, createFinancialYear, deleteFinancialYear, assignFinancialYear, submitYear, reviewAction,
};
