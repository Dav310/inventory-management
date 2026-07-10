import { Request, Response, NextFunction } from "express";
import { getInventory } from "./inventory.service.ts";
import { successResponse } from "../../utils/response.ts";

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getInventory();

    return successResponse(
      res,
      "Inventory fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
