import { Router } from "express";
import { create, getAll } from "./purchase.controller";
import { authMiddleware } from "../../middleware/error.middleware.ts";
import { validatePurchase } from "./purchase.validation.ts";

const purchaseRoutes = Router();

purchaseRoutes.post("/createPurchase", authMiddleware, validatePurchase, create);

purchaseRoutes.get("/getPurchase", authMiddleware, getAll);

export default purchaseRoutes;