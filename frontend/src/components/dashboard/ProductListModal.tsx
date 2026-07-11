import React, { useState } from "react";
import type { Product } from "../../hooks/useDashboardData.ts";
import { X, Search, Boxes } from "lucide-react";

interface ProductListModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ProductListModal: React.FC<ProductListModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Boxes size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base leading-tight">Registered Products</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Total: {products.length} unique codes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-50 bg-white">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search products by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 bg-slate-50/30">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs font-semibold">
                {search ? "No products match your search query." : "No products registered yet."}
              </p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-slate-800 text-sm">{p.product_name}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase tracking-wider">
                    {p.product_id}
                  </span>
                </div>
                {p.description && p.description !== "N/A" && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded border border-slate-100/50">
                    {p.description}
                  </p>
                )}
                <div className="text-[10px] text-slate-400 font-medium mt-1">
                  Registered: {new Date(p.created_at).toLocaleDateString()} at {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
