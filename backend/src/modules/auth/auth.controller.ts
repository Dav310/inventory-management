import type { Request, Response, NextFunction } from "express";
import { authenticateUser } from "./auth.service";
import { successResponse } from "../../utils/response.ts";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authenticateUser(req.body);
    return successResponse(res, "Login Successfull", result);
  } catch (error) {
    next(error);
  }
};
