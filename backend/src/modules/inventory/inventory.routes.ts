import { Router } from "express";
import { getAll } from "./inventory.controller.ts";
import { authMiddleware } from "../../middleware/error.middleware.ts";

const inventoryRoutes = Router();

inventoryRoutes.get("/getInventory", authMiddleware, getAll);

export default inventoryRoutes;
