import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { CompanyService } from './company.service.js';

const getCompanies = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.getCompanies(req.user!.userId, req.user!.role);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Companies retrieved', data: result });
});

const createCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.createCompany(req.body.name, req.user!.userId);
  sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: 'Company created', data: result });
});

const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.updateCompany(req.params.id, req.body.name, req.user!.userId, req.user!.role);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Company updated', data: result });
});

const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.deleteCompany(req.params.id, req.user!.userId, req.user!.role);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Company deleted', data: result });
});

const assignCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.assignCompanyToUser(req.params.id, req.body.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Company assigned', data: result });
});

const unassignCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.unassignCompanyFromUser(req.params.id, req.body.userId);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: 'Company unassigned', data: result });
});

export const CompanyController = {
  getCompanies, createCompany, updateCompany, deleteCompany, assignCompany, unassignCompany,
};
