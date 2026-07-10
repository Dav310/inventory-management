import { Request, Response, NextFunction } from "express";
import { createSale, getSales } from "./sale.service.ts";
import { successResponse } from "../../utils/response.ts";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createSale(req.body);

    return successResponse(
      res,
      "Sale event published successfully",
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
    const result = await getSales();

    return successResponse(
      res,
      "Sales fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
