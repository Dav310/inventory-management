import { Router } from "express";
import { getAll } from "./ledger.controller.ts";
import { authMiddleware } from "../../middleware/error.middleware.ts";

const ledgerRoutes = Router();

ledgerRoutes.get("/getLedger", authMiddleware, getAll);

export default ledgerRoutes;
