import { useState, useEffect, useCallback } from "react";
import { apiService } from "../lib/apiService.ts";

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  inventoryCost: number;
  averageCost: number;
}

export interface LedgerEntry {
  id: number;
  product_id: string;
  transaction_type: "purchase" | "sale";
  quantity: number;
  unit_price: string | null;
  total_cost: string;
  created_at: string;
  product_name: string;
}

export interface InventoryBatch {
  id: number;
  product_id: string;
  quantity: number;
  remaining_quantity: number;
  unit_price: string;
  created_at: string;
  product_name: string;
}

export interface Product {
  id: number;
  product_id: string;
  product_name: string;
  description: string;
  created_at: string;
}

export const useDashboardData = (onLogout: () => void) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    inventoryCost: 0,
    averageCost: 0,
  });
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, ledgerData, inventoryData, productsData] = await Promise.all([
        apiService.getStats(),
        apiService.getLedger(),
        apiService.getInventory(),
        apiService.getProducts(),
      ]);

      setStats(statsData);
      setLedger(ledgerData);
      setBatches(inventoryData);
      setProducts(productsData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [fetchData]);

  return {
    stats,
    ledger,
    batches,
    products,
    loading,
    error,
    refresh: fetchData,
  };
};
