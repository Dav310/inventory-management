import { pool } from "../config/db";

export const database = {
  query: async (text: string, params?: unknown[]) => {
    return pool.query(text, params);
  },
};