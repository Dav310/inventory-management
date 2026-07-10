import { Router } from "express";
import { create, getAll, getById, remove, update } from "./product.controller";
import { authMiddleware } from "../../middleware/error.middleware.ts";
import { validateProduct } from "./product.validation.ts";

const productRoutes = Router();

productRoutes.post("/create", authMiddleware, validateProduct, create);

productRoutes.get("/getAll", authMiddleware, getAll);

productRoutes.get("/get/:id", authMiddleware, getById);

productRoutes.put("/update/:id", authMiddleware, validateProduct, update);

productRoutes.delete("/delete/:id", authMiddleware, remove);

export default productRoutes;
