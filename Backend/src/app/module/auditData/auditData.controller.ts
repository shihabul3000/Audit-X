import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { AuditDataService } from './auditData.service.js';

const getYearData = catchAsync(async (req: Request, res: Response) => {
  const yearId = (req.params as Record<string, string>)['yearId'];
  const result = await AuditDataService.getYearData(yearId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Year data retrieved', data: result });
});

const saveAuditData = catchAsync(async (req: Request, res: Response) => {
  const yearId = (req.params as Record<string, string>)['yearId'];
  const result = await AuditDataService.saveAuditData(yearId, req.body, req.user!.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Audit data saved', data: result });
});

const saveNotesData = catchAsync(async (req: Request, res: Response) => {
  const yearId = (req.params as Record<string, string>)['yearId'];
  const result = await AuditDataService.saveNotesData(yearId, req.body, req.user!.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Notes data saved', data: result });
});

export const AuditDataController = { getYearData, saveAuditData, saveNotesData };
