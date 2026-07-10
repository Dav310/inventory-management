import { Router } from "express";
import { create, getAll } from "./sale.controller.ts";
import { authMiddleware } from "../../middleware/error.middleware.ts";
import { validateSale } from "./sale.validation.ts";

const saleRoutes = Router();

saleRoutes.post("/createSale", authMiddleware, validateSale, create);
saleRoutes.get("/getSales", authMiddleware, getAll);

export default saleRoutes;
