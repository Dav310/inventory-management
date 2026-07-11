import React, { useState, useEffect } from "react";
import type { LedgerEntry } from "../../hooks/useDashboardData.ts";
import { styles } from "../../lib/styles.ts";
import { ArrowDownLeft, ArrowUpRight, Coins, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

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

const rowSx = {
  "&:hover": {
    backgroundColor: "rgba(248, 250, 252, 0.4) !important",
  },
};

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  ledger,
  ledgerTab,
  onTabChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setPage(0);
  }, [ledgerTab]);

  const filteredLedger = ledger.filter((e) =>
    ledgerTab === "buy" ? e.transaction_type === "purchase" : e.transaction_type === "sale"
  );

  const totalItems = filteredLedger.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedLedger = filteredLedger.slice(
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
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Timestamp</TableCell>
              <TableCell sx={headerCellSx}>Product</TableCell>
              <TableCell sx={headerCellSx}>Type</TableCell>
              <TableCell sx={headerCellSx}>Quantity</TableCell>
              <TableCell sx={headerCellSx}>Unit Price</TableCell>
              <TableCell sx={headerCellSx}>Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLedger.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#94a3b8", border: 0 }}>
                  No {ledgerTab === "buy" ? "purchases" : "sales"} recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLedger.map((entry) => (
                <TableRow key={entry.id} hover sx={rowSx}>
                  <TableCell sx={cellSx}>{formatTime(entry.created_at)}</TableCell>
                  <TableCell sx={cellSx}>
                    <div>
                      <div className="font-bold text-slate-800 text-[13px]">{entry.product_name}</div>
                      <div className="text-xs text-slate-400">{entry.product_id}</div>
                    </div>
                  </TableCell>
                  <TableCell sx={cellSx}>
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
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <span className="font-bold text-slate-800">{entry.quantity}</span> units
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {entry.unit_price ? `₹${parseFloat(entry.unit_price).toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <span className="font-extrabold text-slate-800 text-[13px]">
                      ₹{parseFloat(entry.total_cost).toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
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
