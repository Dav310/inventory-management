import React from "react";
import type { InventoryBatch } from "../../hooks/useDashboardData.ts";
import { styles } from "../../lib/styles.ts";
import { Layers } from "lucide-react";

interface InventoryBatchesProps {
  batches: InventoryBatch[];
  expandedProductId: string | null;
  onToggleExpand: (id: string | null) => void;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const InventoryBatches: React.FC<InventoryBatchesProps> = ({
  batches,
  expandedProductId,
  onToggleExpand,
}) => {
  const grouped: {
    product_id: string;
    product_name: string;
    batchesCount: number;
    totalRemaining: number;
    totalValue: number;
    items: typeof batches;
  }[] = [];

  batches.forEach((batch) => {
    let group = grouped.find((g) => g.product_id === batch.product_id);
    if (!group) {
      group = {
        product_id: batch.product_id,
        product_name: batch.product_name,
        batchesCount: 0,
        totalRemaining: 0,
        totalValue: 0,
        items: [],
      };
      grouped.push(group);
    }
    group.batchesCount += 1;
    group.totalRemaining += batch.remaining_quantity;
    group.totalValue += batch.remaining_quantity * parseFloat(batch.unit_price);
    group.items.push(batch);
  });

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Layers className="text-emerald-600" size={20} /> Active Inventory
        Batches (FIFO Queue)
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Oldest batches are consumed first. Click a product row to inspect its
        active batches.
      </p>
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
            {grouped.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-slate-400 font-semibold"
                >
                  Inventory is empty. Register purchases to add stock.
                </td>
              </tr>
            ) : (
              grouped.map((group) => {
                const isExpanded = expandedProductId === group.product_id;
                const avgCost =
                  group.totalRemaining > 0
                    ? group.totalValue / group.totalRemaining
                    : 0;
                return (
                  <React.Fragment key={group.product_id}>
                    <tr
                      onClick={() =>
                        onToggleExpand(isExpanded ? null : group.product_id)
                      }
                      className={`${styles.tableRow} cursor-pointer border-l-4 ${
                        isExpanded
                          ? "border-l-emerald-500 bg-emerald-50/10"
                          : "border-l-transparent"
                      }`}
                    >
                      <td className={styles.tableCell}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] transition-transform duration-200 ${
                              isExpanded
                                ? "rotate-90 text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            ▶
                          </span>
                          <div>
                            <div className="font-bold text-slate-800">
                              {group.product_name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {group.product_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                          {group.batchesCount}{" "}
                          {group.batchesCount === 1 ? "batch" : "batches"}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {group.totalRemaining === 0 ? (
                          <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 text-xs">
                            0 units
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800">
                            {group.totalRemaining} units
                          </span>
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        <span className="font-bold text-slate-800">
                          ₹{avgCost.toFixed(2)}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className="font-extrabold text-emerald-700">
                          ₹{group.totalValue.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td
                          colSpan={5}
                          className="px-4 py-3.5 border-b border-slate-100"
                        >
                          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full text-xs text-left text-slate-600">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                  <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                                    Batch ID
                                  </th>
                                  <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                                    Received Time
                                  </th>
                                  <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                                    Unit Price
                                  </th>
                                  <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                                    Original Qty
                                  </th>
                                  <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                                    Remaining Qty
                                  </th>
                                  <th className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                                    Remaining Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.items.map((b) => (
                                  <tr
                                    key={b.id}
                                    className="hover:bg-slate-50/50"
                                  >
                                    <td className="px-3 py-2.5 font-semibold text-slate-500">
                                      BATCH-{b.id}
                                    </td>
                                    <td className="px-3 py-2.5 text-slate-500">
                                      {formatTime(b.created_at)}
                                    </td>
                                    <td className="px-3 py-2.5 font-bold text-slate-800">
                                      ₹{parseFloat(b.unit_price).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2.5 text-slate-600">
                                      {b.quantity} units
                                    </td>
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
                                    <td className="px-3 py-2.5 font-extrabold text-slate-800">
                                      ₹
                                      {(
                                        b.remaining_quantity *
                                        parseFloat(b.unit_price)
                                      ).toFixed(2)}
                                    </td>
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
