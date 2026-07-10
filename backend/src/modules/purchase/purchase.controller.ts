import { Request, Response, NextFunction } from "express";

import {
  createPurchase,
  getPurchases,
} from "./purchase.service";

import { successResponse } from "../../utils/response";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createPurchase(req.body);

    return successResponse(
      res,
      "Purchase created successfully",
      result,
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getPurchases();

    return successResponse(
      res,
      "Purchases fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};