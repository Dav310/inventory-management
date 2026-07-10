import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDashboardData } from "../hooks/useDashboardData.ts";
import { StatCard } from "./ui/StatCard.tsx";
import { Input } from "./ui/Input.tsx";
import { Button } from "./ui/Button.tsx";
import { styles } from "../lib/styles.ts";
import { apiService } from "../lib/apiService.ts";
import { 
  Boxes, 
  Layers, 
  Coins, 
  Scale, 
  Plus, 
  LogOut, 
  RotateCw, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft 
} from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const {
    stats,
    ledger,
    batches,
    products,
    error,
    refresh
  } = useDashboardData(onLogout);

  const [activeFormTab, setActiveFormTab] = useState<"product" | "purchase" | "sale">("purchase");
  const [ledgerTab, setLedgerTab] = useState<"buy" | "sell">("buy");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const productForm = useForm();
  const purchaseForm = useForm();
  const saleForm = useForm();

  const onCreateProduct = async (data: any) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await apiService.createProduct(data.product_id, data.product_name, data.description);
      setSubmitSuccess("Product registered successfully!");
      productForm.reset();
      refresh();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to create product");
    }
  };

  const onCreatePurchase = async (data: any) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await apiService.createPurchase(Number(data.productId), Number(data.quantity), Number(data.unitPrice));
      setSubmitSuccess("Purchase event published to Kafka! Ingesting...");
      purchaseForm.reset();
      refresh();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to submit purchase");
    }
  };

  const onCreateSale = async (data: any) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await apiService.createSale(Number(data.productId), Number(data.quantity));
      setSubmitSuccess("Sale event published to Kafka! Ingesting...");
      saleForm.reset();
      refresh();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to submit sale");
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
            footer={<span className="text-slate-400">Unique codes registered</span>}
            className="card-products"
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
            <div className={styles.card}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="text-emerald-600" size={20} /> Transaction Ledger
                </h2>
                <div className="flex border border-slate-100 rounded-xl overflow-hidden bg-slate-50 p-1 w-full sm:w-auto">
                  <button
                    onClick={() => setLedgerTab("buy")}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${ledgerTab === "buy" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    Purchases (Buy)
                  </button>
                  <button
                    onClick={() => setLedgerTab("sell")}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${ledgerTab === "sell" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    Sales (Sell)
                  </button>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeaderCell}>Timestamp</th>
                      <th className={styles.tableHeaderCell}>Product</th>
                      <th className={styles.tableHeaderCell}>Type</th>
                      <th className={styles.tableHeaderCell}>Quantity</th>
                      <th className={styles.tableHeaderCell}>Unit Price</th>
                      <th className={styles.tableHeaderCell}>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.filter(e => ledgerTab === "buy" ? e.transaction_type === "purchase" : e.transaction_type === "sale").length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400 font-semibold">
                          No {ledgerTab === "buy" ? "purchases" : "sales"} recorded yet.
                        </td>
                      </tr>
                    ) : (
                      ledger
                        .filter(e => ledgerTab === "buy" ? e.transaction_type === "purchase" : e.transaction_type === "sale")
                        .map((entry) => (
                          <tr key={entry.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>
                              {formatTime(entry.created_at)}
                            </td>
                            <td className={styles.tableCell}>
                              <div>
                                <div className="font-bold text-slate-800">{entry.product_name}</div>
                                <div className="text-xs text-slate-400">{entry.product_id}</div>
                              </div>
                            </td>
                            <td className={styles.tableCell}>
                              <span className={entry.transaction_type === "purchase" ? styles.badgePurchase : styles.badgeSale}>
                                {entry.transaction_type === "purchase" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                {entry.transaction_type.toUpperCase()}
                              </span>
                            </td>
                            <td className={styles.tableCell}><span className="font-bold text-slate-800">{entry.quantity}</span> units</td>
                            <td className={styles.tableCell}>
                              {entry.unit_price ? `₹${parseFloat(entry.unit_price).toFixed(2)}` : "—"}
                            </td>
                            <td className={styles.tableCell}><span className="font-extrabold text-slate-800">₹{parseFloat(entry.total_cost).toFixed(2)}</span></td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Layers className="text-emerald-600" size={20} /> Active Inventory Batches (FIFO Queue)
              </h2>
              <p className="text-xs text-slate-500 mb-4">Oldest batches are consumed first. Click a product row to inspect its active batches.</p>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeaderCell}>Product</th>
                      <th className={styles.tableHeaderCell}>Active Batches</th>
                      <th className={styles.tableHeaderCell}>Total Stock</th>
                      <th className={styles.tableHeaderCell}>Avg Cost / Unit</th>
                      <th className={styles.tableHeaderCell}>Total Valuation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const grouped: {
                        product_id: string;
                        product_name: string;
                        batchesCount: number;
                        totalRemaining: number;
                        totalValue: number;
                        items: typeof batches;
                      }[] = [];

                      batches.forEach((batch) => {
                        let group = grouped.find(g => g.product_id === batch.product_id);
                        if (!group) {
                          group = {
                            product_id: batch.product_id,
                            product_name: batch.product_name,
                            batchesCount: 0,
                            totalRemaining: 0,
                            totalValue: 0,
                            items: []
                          };
                          grouped.push(group);
                        }
                        group.batchesCount += 1;
                        group.totalRemaining += batch.remaining_quantity;
                        group.totalValue += batch.remaining_quantity * parseFloat(batch.unit_price);
                        group.items.push(batch);
                      });

                      if (grouped.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-400 font-semibold">
                              Inventory is empty. Register purchases to add stock.
                            </td>
                          </tr>
                        );
                      }

                      return grouped.map((group) => {
                        const isExpanded = expandedProductId === group.product_id;
                        const avgCost = group.totalRemaining > 0 ? (group.totalValue / group.totalRemaining) : 0;
                        return (
                          <React.Fragment key={group.product_id}>
                            <tr 
                              onClick={() => setExpandedProductId(isExpanded ? null : group.product_id)}
                              className={`${styles.tableRow} cursor-pointer border-l-4 ${isExpanded ? "border-l-emerald-500 bg-emerald-50/10" : "border-l-transparent"}`}
                            >
                              <td className={styles.tableCell}>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] transition-transform duration-200 ${isExpanded ? "rotate-90 text-emerald-600" : "text-slate-400"}`}>▶</span>
                                  <div>
                                    <div className="font-bold text-slate-800">{group.product_name}</div>
                                    <div className="text-xs text-slate-400">{group.product_id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className={styles.tableCell}>
                                <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                                  {group.batchesCount} {group.batchesCount === 1 ? "batch" : "batches"}
                                </span>
                              </td>
                              <td className={styles.tableCell}>
                                {group.totalRemaining === 0 ? (
                                  <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 text-xs">
                                    0 units
                                  </span>
                                ) : (
                                  <span className="font-bold text-slate-800">{group.totalRemaining} units</span>
                                )}
                              </td>
                              <td className={styles.tableCell}>
                                <span className="font-bold text-slate-800">₹{avgCost.toFixed(2)}</span>
                              </td>
                              <td className={styles.tableCell}>
                                <span className="font-extrabold text-emerald-700">₹{group.totalValue.toFixed(2)}</span>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-slate-50/30">
                                <td colSpan={5} className="px-4 py-3.5 border-b border-slate-100">
                                  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                                    <table className="w-full text-xs text-left text-slate-600">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                          <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Batch ID</th>
                                          <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Received Time</th>
                                          <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Unit Price</th>
                                          <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Original Qty</th>
                                          <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Remaining Qty</th>
                                          <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Remaining Value</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {group.items.map((b) => (
                                          <tr key={b.id} className="hover:bg-slate-50/50">
                                            <td className="px-3 py-2.5 font-semibold text-slate-500">BATCH-{b.id}</td>
                                            <td className="px-3 py-2.5 text-slate-500">{formatTime(b.created_at)}</td>
                                            <td className="px-3 py-2.5 font-bold text-slate-800">₹{parseFloat(b.unit_price).toFixed(2)}</td>
                                            <td className="px-3 py-2.5 text-slate-600">{b.quantity} units</td>
                                            <td className="px-3 py-2.5">
                                              {b.remaining_quantity === 0 ? (
                                                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50 text-[11px]">
                                                  0 units
                                                </span>
                                              ) : (
                                                <span className="font-bold text-emerald-700 bg-emerald-50/20 px-2 py-0.5 rounded border border-emerald-100/30 text-[11px]">
                                                  {b.remaining_quantity} units
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-3 py-2.5 font-extrabold text-slate-800">₹{(b.remaining_quantity * parseFloat(b.unit_price)).toFixed(2)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div className={styles.sideColumn}>
            <div className={styles.card}>
              <div className="flex border-b border-slate-100 mb-6">
                <button 
                  onClick={() => setActiveFormTab("purchase")}
                  className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${activeFormTab === "purchase" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setActiveFormTab("sale")}
                  className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${activeFormTab === "sale" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  Sell
                </button>
                <button 
                  onClick={() => setActiveFormTab("product")}
                  className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${activeFormTab === "product" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  Product
                </button>
              </div>

              {activeFormTab === "purchase" && (
                <form onSubmit={purchaseForm.handleSubmit(onCreatePurchase)} className="space-y-4">
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Select Product</label>
                    <select 
                      {...purchaseForm.register("productId", { required: "Please select a product" })}
                      className={styles.input}
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.product_name} ({p.product_id})</option>
                      ))}
                    </select>
                    {purchaseForm.formState.errors.productId && (
                      <p className={styles.inputError}>{purchaseForm.formState.errors.productId.message as string}</p>
                    )}
                  </div>
                  <Input 
                    label="Quantity" 
                    type="number" 
                    placeholder="e.g. 50"
                    {...purchaseForm.register("quantity", { required: "Quantity is required", min: { value: 1, message: "Min quantity is 1" } })}
                    error={purchaseForm.formState.errors.quantity?.message as string}
                  />
                  <Input 
                    label="Unit Price (₹)" 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g. 100.00"
                    {...purchaseForm.register("unitPrice", { required: "Unit Price is required", min: { value: 0.01, message: "Min price is 0.01" } })}
                    error={purchaseForm.formState.errors.unitPrice?.message as string}
                  />
                  <Button type="submit">Publish Buy Event <PlusCircle size={16} /></Button>
                </form>
              )}

              {activeFormTab === "sale" && (
                <form onSubmit={saleForm.handleSubmit(onCreateSale)} className="space-y-4">
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Select Product</label>
                    <select 
                      {...saleForm.register("productId", { required: "Please select a product" })}
                      className={styles.input}
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.product_name} ({p.product_id})</option>
                      ))}
                    </select>
                    {saleForm.formState.errors.productId && (
                      <p className={styles.inputError}>{saleForm.formState.errors.productId.message as string}</p>
                    )}
                  </div>
                  <Input 
                    label="Quantity to Sell" 
                    type="number" 
                    placeholder="e.g. 20"
                    {...saleForm.register("quantity", { required: "Quantity is required", min: { value: 1, message: "Min quantity is 1" } })}
                    error={saleForm.formState.errors.quantity?.message as string}
                  />
                  <Button type="submit">Publish Sell Event <ArrowUpRight size={16} /></Button>
                </form>
              )}

              {activeFormTab === "product" && (
                <form onSubmit={productForm.handleSubmit(onCreateProduct)} className="space-y-4">
                  <Input 
                    label="Product Code (product_id)" 
                    placeholder="e.g. PRD001"
                    {...productForm.register("product_id", { required: "Product code is required" })}
                    error={productForm.formState.errors.product_id?.message as string}
                  />
                  <Input 
                    label="Product Name" 
                    placeholder="e.g. Dell Laptop"
                    {...productForm.register("product_name", { required: "Product name is required" })}
                    error={productForm.formState.errors.product_name?.message as string}
                  />
                  <Input 
                    label="Description" 
                    placeholder="e.g. Core i7 16GB RAM"
                    {...productForm.register("description")}
                  />
                  <Button type="submit">Register Product <Plus size={16} /></Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
