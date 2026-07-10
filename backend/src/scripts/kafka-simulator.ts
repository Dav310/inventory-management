import { publishEvent } from "../kafka/producer.ts";
import { TOPIC_INVENTORY_EVENTS } from "../kafka/topics.ts";
import { pool } from "../config/db.ts";

async function main() {
  console.log("🚀 Starting Kafka Simulator...");

  // Ensure a product exists in DB
  const productsRes = await pool.query("SELECT * FROM products");
  let productCode = "PRD001";
  if (productsRes.rows.length === 0) {
    console.log("No products found in DB. Seeding default product PRD001...");
    await pool.query(
      "INSERT INTO products (product_id, product_name, description) VALUES ($1, $2, $3)",
      ["PRD001", "Default Product", "Seeded by simulator"]
    );
  } else {
    productCode = productsRes.rows[0].product_id;
  }

  // Generate 6 simulated events: 3 purchases and 3 sales
  const events = [
    { product_id: productCode, event_type: "purchase", quantity: 10, unit_price: 100.0, timestamp: new Date().toISOString() },
    { product_id: productCode, event_type: "purchase", quantity: 20, unit_price: 110.0, timestamp: new Date().toISOString() },
    { product_id: productCode, event_type: "sale", quantity: 5, timestamp: new Date().toISOString() },
    { product_id: productCode, event_type: "purchase", quantity: 15, unit_price: 120.0, timestamp: new Date().toISOString() },
    { product_id: productCode, event_type: "sale", quantity: 15, timestamp: new Date().toISOString() },
    { product_id: productCode, event_type: "sale", quantity: 10, timestamp: new Date().toISOString() },
  ];

  console.log(`Publishing ${events.length} simulated events to Kafka...`);

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    console.log(`[Event ${i+1}/${events.length}] Publishing ${event.event_type} of ${event.quantity} for ${event.product_id}...`);
    await publishEvent(TOPIC_INVENTORY_EVENTS, event);
    // Wait a brief moment between events
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("✅ Kafka Simulator finished. Events published successfully!");
  await pool.end();
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Kafka Simulator failed:", err);
  process.exit(1);
});
