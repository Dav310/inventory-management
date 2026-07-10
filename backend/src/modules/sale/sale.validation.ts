import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/response.ts";

export const validateSale = (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  if (!productId || typeof productId !== "number" || productId <= 0) {
    return errorResponse(res, "Product ID must be a positive number", 400);
  }
  if (!quantity || typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
    return errorResponse(res, "Quantity must be a positive integer", 400);
  }
  next();
};
