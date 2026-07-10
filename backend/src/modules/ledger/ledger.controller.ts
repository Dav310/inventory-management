import { Request, Response, NextFunction } from "express";
import { getLedger } from "./ledger.service.ts";
import { successResponse } from "../../utils/response.ts";

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getLedger();

    return successResponse(
      res,
      "Ledger fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
