import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/response.ts";

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { product_id, product_name } = req.body;
  if (!product_id || typeof product_id !== "string" || product_id.trim() === "") {
    return errorResponse(res, "Product ID (code) is required and must be a string", 400);
  }
  if (!product_name || typeof product_name !== "string" || product_name.trim() === "") {
    return errorResponse(res, "Product Name is required and must be a string", 400);
  }
  next();
};
