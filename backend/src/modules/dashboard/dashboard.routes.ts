import { Router } from "express";
import { getStats } from "./dashboard.controller.ts";
import { authMiddleware } from "../../middleware/error.middleware.ts";

const dashboardRoutes = Router();

dashboardRoutes.get("/getStats", authMiddleware, getStats);

export default dashboardRoutes;
