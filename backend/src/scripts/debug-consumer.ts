import { pool } from "../config/db.ts";
import { executeFIFO } from "../modules/inventory/fifo.service.ts";
import { dbInsertSale } from "../modules/sale/sale.service.ts";
import { dbInsertLedger } from "../modules/ledger/ledger.service.ts";

async function main() {
  console.log("Debugging consumer sale processing directly...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Let's find the last created product from the test run
    const prodRes = await client.query("SELECT * FROM products WHERE product_id LIKE 'PRD-TEST-%' ORDER BY id DESC LIMIT 1");
    if (prodRes.rows.length === 0) {
      throw new Error("No test product found in DB. Run integration test first.");
    }
    const product = prodRes.rows[0];
    const productCode = product.product_id;
    const quantity = 15;

    console.log(`Product found: ${productCode}. Executing FIFO for quantity: ${quantity}...`);
    const totalCost = await executeFIFO(client, productCode, quantity);
    console.log(`FIFO executed. Total cost calculated: ${totalCost}`);

    console.log("Inserting sale record...");
    const sale = await dbInsertSale(client, productCode, quantity, totalCost);
    console.log("Sale inserted:", sale);

    console.log("Inserting ledger entry...");
    const avgUnitPrice = totalCost / quantity;
    const ledger = await dbInsertLedger(client, productCode, "sale", quantity, avgUnitPrice, totalCost);
    console.log("Ledger inserted:", ledger);

    await client.query("COMMIT");
    console.log("✅ Transaction committed successfully!");

  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction failed and rolled back. Error:", err.message, err.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
