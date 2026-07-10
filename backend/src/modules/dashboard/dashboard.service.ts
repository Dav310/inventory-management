import { database } from "../../utils/database.ts";
import type { DashboardStats } from "./dashboard.types.ts";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const result = await database.query(`
    SELECT
      (SELECT COUNT(*) FROM products)::integer as total_products,
      COALESCE(SUM(remaining_quantity), 0)::integer as total_stock,
      COALESCE(SUM(remaining_quantity * unit_price), 0)::numeric as total_cost
    FROM inventory_batch
  `);

  const row = result.rows[0];
  const totalProducts = row?.total_products || 0;
  const totalStock = row?.total_stock || 0;
  const inventoryCost = parseFloat(row?.total_cost || "0");
  const averageCost = totalStock > 0 ? inventoryCost / totalStock : 0;

  return {
    totalProducts,
    totalStock,
    inventoryCost,
    averageCost: parseFloat(averageCost.toFixed(2)),
  };
};
