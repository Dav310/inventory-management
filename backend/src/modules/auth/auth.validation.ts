import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/response.ts";

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || typeof username !== "string" || username.trim() === "") {
    return errorResponse(res, "Username is required", 400);
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    return errorResponse(res, "Password is required", 400);
  }
  next();
};
