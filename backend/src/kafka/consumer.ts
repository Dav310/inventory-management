import { kafka } from "../config/kafka.ts";
import { pool } from "../config/db.ts";
import { TOPIC_INVENTORY_EVENTS } from "./topics.ts";
import { dbInsertPurchase } from "../modules/purchase/purchase.service.ts";
import { dbInsertInventoryBatch } from "../modules/inventory/inventory.service.ts";
import { executeFIFO } from "../modules/inventory/fifo.service.ts";
import { dbInsertSale } from "../modules/sale/sale.service.ts";
import { dbInsertLedger } from "../modules/ledger/ledger.service.ts";

const consumer = kafka.consumer({ groupId: "inventory-group" });

export const startConsumer = async () => {
  try {
    await consumer.connect();
    console.log("🟢 Kafka Consumer connected");

    await consumer.subscribe({ topic: TOPIC_INVENTORY_EVENTS, fromBeginning: true });
    console.log(`🟢 Kafka Consumer subscribed to "${TOPIC_INVENTORY_EVENTS}"`);

    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const client = await pool.connect();

        try {
          const event = JSON.parse(value);
          console.log("📥 Received Kafka Event:", event);

          const { product_id, event_type, quantity } = event;

          await client.query("BEGIN");

          const productResult = await client.query(
            "SELECT * FROM products WHERE product_id = $1",
            [product_id],
          );

          if (productResult.rows.length === 0) {
            throw new Error(`Product with code ${product_id} not found`);
          }

          const product = productResult.rows[0];
          const productCode = product.product_id;

          if (event_type === "purchase") {
            const { unit_price } = event;
            const totalCost = quantity * unit_price;

            await dbInsertPurchase(client, productCode, quantity, unit_price);

            await dbInsertInventoryBatch(client, productCode, quantity, unit_price);

            await dbInsertLedger(client, productCode, "purchase", quantity, unit_price, totalCost);

            console.log(`✅ Purchase processed for Product: ${productCode}, Qty: ${quantity}`);

          } else if (event_type === "sale") {
            const totalCost = await executeFIFO(client, productCode, quantity);

            await dbInsertSale(client, productCode, quantity, totalCost);

            const avgUnitPrice = totalCost / quantity;
            await dbInsertLedger(client, productCode, "sale", quantity, avgUnitPrice, totalCost);

            console.log(`✅ Sale processed (FIFO) for Product: ${productCode}, Qty: ${quantity}, Total Cost: ${totalCost}`);

          } else {
            console.warn("⚠️ Unknown event type:", event_type);
          }

          await client.query("COMMIT");
        } catch (err) {
          await client.query("ROLLBACK");
          console.error("❌ Transaction failed, rolled back. Error:", err);
        } finally {
          client.release();
        }
      },
    });
  } catch (error) {
    console.error("❌ Kafka Consumer startup failed:", error);
  }
};

export const stopConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log("🔴 Kafka Consumer disconnected");
  } catch (error) {
    console.error("❌ Kafka Consumer disconnect failed:", error);
  }
};
