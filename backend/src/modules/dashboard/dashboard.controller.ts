import { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "./dashboard.service.ts";
import { successResponse } from "../../utils/response.ts";

export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await getDashboardStats();
    return successResponse(res, "Dashboard stats fetched successfully", stats);
  } catch (error) {
    next(error);
  }
};
