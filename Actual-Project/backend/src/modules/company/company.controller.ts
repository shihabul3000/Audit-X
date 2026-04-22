import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import * as companyService from "./company.service";

const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown
) => {
  res.status(statusCode).json({
    message,
    statusCode,
    data,
  });
};

export const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, searchTerm } = req.query;
    const result = await companyService.getAll(
      req.user!.id,
      req.user!.role,
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        searchTerm: searchTerm as string | undefined,
      }
    );
    sendResponse(res, 200, "Companies fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await companyService.getById(
      req.params.id,
      req.user!.id,
      req.user!.role
    );
    sendResponse(res, 200, "Company fetched successfully", company);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, address } = req.body;
    const company = await companyService.create(name, address, req.user!.id);
    sendResponse(res, 201, "Company created successfully", company);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await companyService.update(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.role
    );
    sendResponse(res, 200, "Company updated successfully", company);
  } catch (error) {
    next(error);
  }
};

export const softDelete = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await companyService.softDelete(
      req.params.id,
      req.user!.id,
      req.user!.role
    );
    sendResponse(res, 200, "Company deleted successfully", company);
  } catch (error) {
    next(error);
  }
};

export const assign = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const result = await companyService.assign(
      req.params.id,
      userId,
      req.user!.id
    );
    sendResponse(res, 200, "User assigned successfully", result);
  } catch (error) {
    next(error);
  }
};

export const unassign = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const result = await companyService.unassign(req.params.id, userId);
    sendResponse(res, 200, "User unassigned successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await companyService.getMembers(req.params.id);
    sendResponse(res, 200, "Members fetched successfully", members);
  } catch (error) {
    next(error);
  }
};