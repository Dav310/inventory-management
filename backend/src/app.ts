import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.ts";
import authRoutes from "./modules/auth/auth.routes.ts";
import productRoutes from "./modules/products/product.routes.ts";
import purchaseRoutes from "./modules/purchase/purchase.routes.ts";
import saleRoutes from "./modules/sale/sale.routes.ts";
import ledgerRoutes from "./modules/ledger/ledger.routes.ts";
import inventoryRoutes from "./modules/inventory/inventory.routes.ts";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.ts";

const app  = express();

const allowedOrigins = [
  process.env.LIVE_URL 
  // || process.env.LOCAL_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));



app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success:true,
    message:"🟢 Inventory Management API is Running"
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/purchases", purchaseRoutes)
app.use("/api/sales", saleRoutes)
app.use("/api/ledger", ledgerRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.use(errorMiddleware);

export default app;