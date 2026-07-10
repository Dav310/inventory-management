import { NextFunction, Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.service";
import { successResponse } from "../../utils/response";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createProduct(req.body);

    return successResponse(res, "Product created successfully", result, 201);
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
    const result = await getProducts();

    return successResponse(res, "Products fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getProductById(Number(req.params.id));

    return successResponse(res, "Product fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateProduct(Number(req.params.id), req.body);

    return successResponse(res, "Product updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteProduct(Number(req.params.id));

    return successResponse(res, "Product deleted successfully", result);
  } catch (error) {
    next(error);
  }
};
