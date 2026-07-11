import React, { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData.ts";
import { StatCard } from "./ui/StatCard.tsx";
import { styles } from "../lib/styles.ts";
import { TransactionLedger } from "./dashboard/TransactionLedger.tsx";
import { InventoryBatches } from "./dashboard/InventoryBatches.tsx";
import { ProductForms } from "./dashboard/ProductForms.tsx";
import { ProductListModal } from "./dashboard/ProductListModal.tsx";
import { 
  Boxes, 
  Layers, 
  Coins, 
  Scale, 
  LogOut, 
  RotateCw 
} from "lucide-react";
import { apiService } from "../lib/apiService.ts";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const {
    stats,
    ledger,
    batches,
    products,
    error,
    refresh
  } = useDashboardData(onLogout);

  const [ledgerTab, setLedgerTab] = useState<"buy" | "sell">("buy");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const onSubmitProduct = async (data: any): Promise<boolean> => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await apiService.createProduct(data.product_id, data.product_name, data.description);
      setSubmitSuccess("Product registered successfully!");
      refresh();
      return true;
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to create product");
      return false;
    }
  };

  const onSubmitPurchase = async (data: any): Promise<boolean> => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await apiService.createPurchase(Number(data.productId), Number(data.quantity), Number(data.unitPrice));
      setSubmitSuccess("Purchase event published to Kafka! Ingesting...");
      refresh();
      return true;
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to submit purchase");
      return false;
    }
  };

  const onSubmitSale = async (data: any): Promise<boolean> => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await apiService.createSale(Number(data.productId), Number(data.quantity));
      setSubmitSuccess("Sale event published to Kafka! Ingesting...");
      refresh();
      return true;
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to submit sale");
      return false;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Boxes size={24} />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">FIFO Inventory</span>
          </div>

          <div className="flex items-center gap-4">
            <span className={styles.headerStatus}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Ingestion Connected
            </span>
            <button 
              onClick={refresh}
              title="Manual Sync"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCw size={18} />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.layoutWrapper}>
        {(error || submitError) && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold shadow-sm">
            {error || submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold shadow-sm">
            {submitSuccess}
          </div>
        )}

        <section className={styles.metricGrid}>
          <StatCard 
            label="Total Products" 
            value={stats.totalProducts} 
            icon={<Boxes size={20} />} 
            footer={<span className="text-emerald-700 font-medium">Click to view all products →</span>}
            className="card-products cursor-pointer"
            onClick={() => setIsProductModalOpen(true)}
          />
          <StatCard 
            label="Total Stock in Hand" 
            value={stats.totalStock} 
            icon={<Layers size={20} />} 
            footer={<span className="text-slate-400">Remaining batch units</span>}
            className="card-stock"
          />
          <StatCard 
            label="Total Inventory Value" 
            value={`₹${stats.inventoryCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            icon={<Coins size={20} />} 
            footer={<span className="text-slate-400">Valued using FIFO cost</span>}
            className="card-value"
          />
          <StatCard 
            label="Average Cost per Unit" 
            value={`₹${stats.averageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            icon={<Scale size={20} />} 
            footer={<span className="text-slate-400">Average unit valuation</span>}
            className="card-average"
          />
        </section>

        <div className={styles.splitLayout}>
          <div className={styles.mainColumn}>
            <TransactionLedger 
              ledger={ledger}
              ledgerTab={ledgerTab}
              onTabChange={setLedgerTab}
            />

            <InventoryBatches 
              batches={batches}
              expandedProductId={expandedProductId}
              onToggleExpand={setExpandedProductId}
            />
          </div>

          <div className={styles.sideColumn}>
            <ProductForms 
              products={products}
              onSubmitProduct={onSubmitProduct}
              onSubmitPurchase={onSubmitPurchase}
              onSubmitSale={onSubmitSale}
            />
          </div>
        </div>
      </main>

      <ProductListModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        products={products}
      />
    </div>
  );
};
