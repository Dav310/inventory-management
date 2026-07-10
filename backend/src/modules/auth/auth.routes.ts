import { Router } from "express";
import { login } from "./auth.controller";
import { validateLogin } from "./auth.validation.ts";

const authRoutes = Router();

authRoutes.post("/login", validateLogin, login);

export default authRoutes;