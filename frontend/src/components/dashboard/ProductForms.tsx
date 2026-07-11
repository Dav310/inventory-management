import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "../../hooks/useDashboardData.ts";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import { styles } from "../../lib/styles.ts";
import { Plus, PlusCircle, ArrowUpRight } from "lucide-react";

interface ProductFormsProps {
  products: Product[];
  onSubmitProduct: (data: any) => Promise<boolean>;
  onSubmitPurchase: (data: any) => Promise<boolean>;
  onSubmitSale: (data: any) => Promise<boolean>;
}

export const ProductForms: React.FC<ProductFormsProps> = ({
  products,
  onSubmitProduct,
  onSubmitPurchase,
  onSubmitSale,
}) => {
  const [activeFormTab, setActiveFormTab] = useState<"purchase" | "sale" | "product">("purchase");

  const productForm = useForm();
  const purchaseForm = useForm();
  const saleForm = useForm();

  const handleProductSubmit = async (data: any) => {
    const success = await onSubmitProduct(data);
    if (success) productForm.reset();
  };

  const handlePurchaseSubmit = async (data: any) => {
    const success = await onSubmitPurchase(data);
    if (success) purchaseForm.reset();
  };

  const handleSaleSubmit = async (data: any) => {
    const success = await onSubmitSale(data);
    if (success) saleForm.reset();
  };

  return (
    <div className={styles.card}>
      <div className="flex border-b border-slate-100 mb-6">
        <button
          onClick={() => setActiveFormTab("purchase")}
          className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
            activeFormTab === "purchase"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveFormTab("sale")}
          className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
            activeFormTab === "sale"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Sell
        </button>
        <button
          onClick={() => setActiveFormTab("product")}
          className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
            activeFormTab === "product"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Product
        </button>
      </div>

      {activeFormTab === "purchase" && (
        <form onSubmit={purchaseForm.handleSubmit(handlePurchaseSubmit)} className="space-y-4">
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Product</label>
            <select
              {...purchaseForm.register("productId", { required: "Please select a product" })}
              className={styles.input}
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} ({p.product_id})
                </option>
              ))}
            </select>
            {purchaseForm.formState.errors.productId && (
              <p className={styles.inputError}>
                {purchaseForm.formState.errors.productId.message as string}
              </p>
            )}
          </div>
          <Input
            label="Quantity"
            type="number"
            placeholder="e.g. 50"
            {...purchaseForm.register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Min quantity is 1" },
            })}
            error={purchaseForm.formState.errors.quantity?.message as string}
          />
          <Input
            label="Unit Price (₹)"
            type="number"
            step="0.01"
            placeholder="e.g. 100.00"
            {...purchaseForm.register("unitPrice", {
              required: "Unit Price is required",
              min: { value: 0.01, message: "Min price is 0.01" },
            })}
            error={purchaseForm.formState.errors.unitPrice?.message as string}
          />
          <Button type="submit">
            Publish Buy Event <PlusCircle size={16} />
          </Button>
        </form>
      )}

      {activeFormTab === "sale" && (
        <form onSubmit={saleForm.handleSubmit(handleSaleSubmit)} className="space-y-4">
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Product</label>
            <select
              {...saleForm.register("productId", { required: "Please select a product" })}
              className={styles.input}
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} ({p.product_id})
                </option>
              ))}
            </select>
            {saleForm.formState.errors.productId && (
              <p className={styles.inputError}>
                {saleForm.formState.errors.productId.message as string}
              </p>
            )}
          </div>
          <Input
            label="Quantity to Sell"
            type="number"
            placeholder="e.g. 20"
            {...saleForm.register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Min quantity is 1" },
            })}
            error={saleForm.formState.errors.quantity?.message as string}
          />
          <Button type="submit">
            Publish Sell Event <ArrowUpRight size={16} />
          </Button>
        </form>
      )}

      {activeFormTab === "product" && (
        <div className="space-y-6">
          <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
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
            <Button type="submit">
              Register Product <Plus size={16} />
            </Button>
          </form>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Registered Products ({products.length})
            </h3>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {products.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 font-semibold bg-slate-50 rounded-xl border border-slate-100">
                  No products registered yet.
                </p>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors duration-200 flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-800 text-sm">{p.product_name}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 text-slate-600 rounded border border-slate-300/30 uppercase tracking-wider">
                        {p.product_id}
                      </span>
                    </div>
                    {p.description && p.description !== "N/A" && (
                      <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
