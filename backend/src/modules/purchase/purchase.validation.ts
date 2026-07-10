import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/response.ts";

export const validatePurchase = (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity, unitPrice } = req.body;
  if (!productId || typeof productId !== "number" || productId <= 0) {
    return errorResponse(res, "Product ID must be a positive number", 400);
  }
  if (!quantity || typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
    return errorResponse(res, "Quantity must be a positive integer", 400);
  }
  if (!unitPrice || typeof unitPrice !== "number" || unitPrice <= 0) {
    return errorResponse(res, "Unit Price must be a positive number", 400);
  }
  next();
};
