import { pool } from "../config/db.ts";

async function main() {
  console.log("Cleaning database tables...");
  await pool.query("TRUNCATE TABLE inventory_ledger, sales, purchases, inventory_batch RESTART IDENTITY CASCADE;");
  console.log("Database cleared successfully!");
  await pool.end();
  process.exit(0);
}

main().catch(err => {
  console.error("Failed to clear DB:", err);
  process.exit(1);
});
