import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

interface JwtPayload {
  userId: number;
  username: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn:"1d",
  });
};

export const verifyToken= (token:string) => {
  return jwt.verify(token, env.JWT_SECRET)
}
