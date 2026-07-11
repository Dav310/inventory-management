import React, { useState, useEffect } from "react";
import type { InventoryBatch } from "../../hooks/useDashboardData.ts";
import { styles } from "../../lib/styles.ts";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

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

const headerCellSx = {
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  py: 1.5,
  px: 2,
  borderBottom: "1px solid #f1f5f9",
  backgroundColor: "rgba(248, 250, 252, 0.75)",
};

const cellSx = {
  fontSize: "0.875rem",
  color: "#334155",
  py: 2,
  px: 2,
  borderBottom: "1px solid #f8fafc",
  whiteSpace: "nowrap",
};

export const InventoryBatches: React.FC<InventoryBatchesProps> = ({
  batches,
  expandedProductId,
  onToggleExpand,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const totalItems = grouped.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  useEffect(() => {
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1);
    }
  }, [totalPages, page]);

  const paginatedGrouped = grouped.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const pagesCount = Math.max(1, totalPages);

    if (pagesCount <= maxVisiblePages) {
      for (let i = 0; i < pagesCount; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, page - 2);
      let end = Math.min(pagesCount - 1, page + 2);

      if (page <= 2) {
        end = 4;
      } else if (page >= pagesCount - 3) {
        start = pagesCount - 5;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Layers className="text-emerald-600" size={20} /> Active Inventory Batches (FIFO Queue)
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Oldest batches are consumed first. Click a product row to inspect its active batches.
      </p>
      <div className={styles.tableContainer}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Product</TableCell>
              <TableCell sx={headerCellSx}>Active Batches</TableCell>
              <TableCell sx={headerCellSx}>Total Stock</TableCell>
              <TableCell sx={headerCellSx}>Avg Cost / Unit</TableCell>
              <TableCell sx={headerCellSx}>Total Valuation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGrouped.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#94a3b8", border: 0 }}>
                  Inventory is empty. Register purchases to add stock.
                </TableCell>
              </TableRow>
            ) : (
              paginatedGrouped.map((group) => {
                const isExpanded = expandedProductId === group.product_id;
                const avgCost =
                  group.totalRemaining > 0 ? group.totalValue / group.totalRemaining : 0;
                return (
                  <React.Fragment key={group.product_id}>
                    <TableRow
                      onClick={() => onToggleExpand(isExpanded ? null : group.product_id)}
                      hover
                      sx={{
                        cursor: "pointer",
                        borderLeft: isExpanded ? "4px solid #10b981" : "4px solid transparent",
                        backgroundColor: isExpanded ? "rgba(16, 185, 129, 0.04) !important" : "inherit",
                        "&:hover": {
                          backgroundColor: "rgba(248, 250, 252, 0.4) !important",
                        },
                      }}
                    >
                      <TableCell sx={cellSx}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] transition-transform duration-200 ${
                              isExpanded ? "rotate-90 text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            ▶
                          </span>
                          <div>
                            <div className="font-bold text-slate-800">{group.product_name}</div>
                            <div className="text-xs text-slate-400">{group.product_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                          {group.batchesCount} {group.batchesCount === 1 ? "batch" : "batches"}
                        </span>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        {group.totalRemaining === 0 ? (
                          <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 text-xs">
                            0 units
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800">{group.totalRemaining} units</span>
                        )}
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <span className="font-bold text-slate-800">₹{avgCost.toFixed(2)}</span>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <span className="font-extrabold text-emerald-700">
                          ₹{group.totalValue.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow sx={{ backgroundColor: "rgba(248, 250, 252, 0.3)" }}>
                        <TableCell colSpan={5} sx={{ p: 2, borderBottom: "1px solid #f1f5f9" }}>
                          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                  <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", py: 1, px: 2.5 }}>
                                    Batch ID
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", py: 1, px: 2.5 }}>
                                    Received Time
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", py: 1, px: 2.5 }}>
                                    Unit Price
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", py: 1, px: 2.5 }}>
                                    Original Qty
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", py: 1, px: 2.5 }}>
                                    Remaining Qty
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", py: 1, px: 2.5 }}>
                                    Remaining Value
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {group.items.map((b) => (
                                  <TableRow
                                    key={b.id}
                                    hover
                                    sx={{ "& td": { py: 1, px: 2.5, borderBottom: "1px solid #f8fafc" } }}
                                  >
                                    <TableCell sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                                      BATCH-{b.id}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px", color: "#64748b" }}>
                                      {formatTime(b.created_at)}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px", color: "#334155", fontWeight: 700 }}>
                                      ₹{parseFloat(b.unit_price).toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px", color: "#475569" }}>
                                      {b.quantity} units
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px" }}>
                                      {b.remaining_quantity === 0 ? (
                                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50 text-[11px]">
                                          0 units
                                        </span>
                                      ) : (
                                        <span className="font-bold text-emerald-700 bg-emerald-50/20 px-2 py-0.5 rounded border border-emerald-100/30 text-[11px]">
                                          {b.remaining_quantity} units
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px", color: "#1e293b", fontWeight: 800 }}>
                                      ₹{(b.remaining_quantity * parseFloat(b.unit_price)).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="font-bold text-slate-800">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="font-bold text-slate-800">{endIndex}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems}</span> entries
          </div>

          {/* Custom styled select selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">Show:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1 text-[11px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer shadow-sm hover:border-slate-300"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
              page === 0
                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.95]"
            }`}
          >
            <ChevronLeft size={14} />
          </button>

          {getPageNumbers().map((pageIdx) => (
            <button
              key={pageIdx}
              onClick={() => setPage(pageIdx)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                page === pageIdx
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.95]"
                }`}
            >
              {pageIdx + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(Math.max(1, totalPages) - 1, p + 1))}
            disabled={page >= Math.max(1, totalPages) - 1}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
              page >= Math.max(1, totalPages) - 1
                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.95]"
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
