import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";
import { verifyToken } from "../utils/jwt";
import type { AuthUser } from "../modules/auth/auth.types.ts";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
    data: null,
  });
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, "Token is Required", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, "Invalid Token", 401);
  }

  try {
    const decode = verifyToken(token) as AuthUser;

    req.user = decode;

    next()
    
  } catch (error) {
    return errorResponse(res, "Invalid or Expired Token", 401)
  }
};
