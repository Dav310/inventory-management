import { pool } from "../config/db.ts";

async function main() {
  try {
    const products = await pool.query("SELECT * FROM products ORDER BY id DESC LIMIT 5");
    console.log("--- Products ---");
    console.log(products.rows);

    const batches = await pool.query("SELECT * FROM inventory_batch ORDER BY id DESC LIMIT 10");
    console.log("--- Inventory Batches ---");
    console.log(batches.rows);

    const sales = await pool.query("SELECT * FROM sales ORDER BY id DESC LIMIT 10");
    console.log("--- Sales ---");
    console.log(sales.rows);

    const ledger = await pool.query("SELECT * FROM inventory_ledger ORDER BY id DESC LIMIT 10");
    console.log("--- Ledger ---");
    console.log(ledger.rows);

  } catch (err) {
    console.error("DB Query Error:", err);
  } finally {
    await pool.end();
  }
}

main();
