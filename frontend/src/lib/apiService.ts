import { api } from "./api.ts";

export const apiService = {
  login: async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password });
    return res.data.data;
  },

  getStats: async () => {
    const res = await api.get("/dashboard/getStats");
    return res.data.data;
  },

  getLedger: async () => {
    const res = await api.get("/ledger/getLedger");
    return res.data.data;
  },

  getInventory: async () => {
    const res = await api.get("/inventory/getInventory");
    return res.data.data;
  },

  getProducts: async () => {
    const res = await api.get("/products/getAll");
    return res.data.data;
  },

  createProduct: async (product_id: string, product_name: string, description: string) => {
    const res = await api.post("/products/create", {
      product_id,
      product_name,
      description: description || "N/A",
    });
    return res.data.data;
  },

  createPurchase: async (productId: number, quantity: number, unitPrice: number) => {
    const res = await api.post("/purchases/createPurchase", {
      productId,
      quantity,
      unitPrice,
    });
    return res.data.data;
  },

  createSale: async (productId: number, quantity: number) => {
    const res = await api.post("/sales/createSale", {
      productId,
      quantity,
    });
    return res.data.data;
  }
};
