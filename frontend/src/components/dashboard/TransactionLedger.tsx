import React from "react";
import type { LedgerEntry } from "../../hooks/useDashboardData.ts";
import { styles } from "../../lib/styles.ts";
import { Coins, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionLedgerProps {
  ledger: LedgerEntry[];
  ledgerTab: "buy" | "sell";
  onTabChange: (tab: "buy" | "sell") => void;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  ledger,
  ledgerTab,
  onTabChange,
}) => {
  const filteredLedger = ledger.filter((e) =>
    ledgerTab === "buy" ? e.transaction_type === "purchase" : e.transaction_type === "sale"
  );

  return (
    <div className={styles.card}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Coins className="text-emerald-600" size={20} /> Transaction Ledger
        </h2>
        <div className="flex border border-slate-100 rounded-xl overflow-hidden bg-slate-50 p-1 w-full sm:w-auto">
          <button
            onClick={() => onTabChange("buy")}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              ledgerTab === "buy"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Purchases (Buy)
          </button>
          <button
            onClick={() => onTabChange("sell")}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              ledgerTab === "sell"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
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
            {filteredLedger.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 font-semibold">
                  No {ledgerTab === "buy" ? "purchases" : "sales"} recorded yet.
                </td>
              </tr>
            ) : (
              filteredLedger.map((entry) => (
                <tr key={entry.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{formatTime(entry.created_at)}</td>
                  <td className={styles.tableCell}>
                    <div>
                      <div className="font-bold text-slate-800">{entry.product_name}</div>
                      <div className="text-xs text-slate-400">{entry.product_id}</div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={
                        entry.transaction_type === "purchase"
                          ? styles.badgePurchase
                          : styles.badgeSale
                      }
                    >
                      {entry.transaction_type === "purchase" ? (
                        <ArrowDownLeft size={12} />
                      ) : (
                        <ArrowUpRight size={12} />
                      )}
                      {entry.transaction_type.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className="font-bold text-slate-800">{entry.quantity}</span> units
                  </td>
                  <td className={styles.tableCell}>
                    {entry.unit_price ? `₹${parseFloat(entry.unit_price).toFixed(2)}` : "—"}
                  </td>
                  <td className={styles.tableCell}>
                    <span className="font-extrabold text-slate-800">
                      ₹{parseFloat(entry.total_cost).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
