const BASE_URL = "http://127.0.0.1:5000/api";

async function main() {
  console.log("🏁 Starting End-to-End Integration Test Flow...");

  // 1. Login
  console.log("1. Authenticating as admin...");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });

  if (!loginRes.ok) {
    throw new Error(`Authentication failed: ${loginRes.statusText}`);
  }

  const { data: { token } } = await loginRes.json() as any;
  console.log("🔑 JWT Token obtained successfully!");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // 2. Create a test product
  const randId = Math.floor(Math.random() * 10000);
  const testProductCode = `PRD-TEST-${randId}`;
  const testProductName = `Test Product ${randId}`;

  console.log(`2. Creating product ${testProductCode}...`);
  const productRes = await fetch(`${BASE_URL}/products/create`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      product_id: testProductCode,
      product_name: testProductName,
      description: "E2E testing product"
    }),
  });

  if (!productRes.ok) {
    throw new Error(`Product creation failed: ${productRes.statusText}`);
  }

  const { data: product } = await productRes.json() as any;
  console.log(`✅ Product created: ${product.product_name} (ID: ${product.id})`);

  // 3. Purchase 1: 10 units @ $10.00
  console.log("3. Creating first purchase (10 units @ $10.00)...");
  const purchase1Res = await fetch(`${BASE_URL}/purchases/createPurchase`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      productId: product.id,
      quantity: 10,
      unitPrice: 10.00
    }),
  });
  if (!purchase1Res.ok) throw new Error("Purchase 1 failed");
  console.log("✅ Purchase 1 event published.");

  // 4. Purchase 2: 20 units @ $15.00
  console.log("4. Creating second purchase (20 units @ $15.00)...");
  const purchase2Res = await fetch(`${BASE_URL}/purchases/createPurchase`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      productId: product.id,
      quantity: 20,
      unitPrice: 15.00
    }),
  });
  if (!purchase2Res.ok) throw new Error("Purchase 2 failed");
  console.log("✅ Purchase 2 event published.");

  // Wait 4 seconds for consumer to ingest purchases
  console.log("⏳ Waiting 4 seconds for Kafka consumer to process purchases...");
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 5. Check dashboard stats before sale
  console.log("5. Fetching dashboard stats (Expected stock increase: +30, cost increase: +$400.00)...");
  const statsRes = await fetch(`${BASE_URL}/dashboard/getStats`, { headers });
  const statsData = await statsRes.json() as any;
  console.log("📊 Dashboard Stats:", statsData.data);

  // 6. Create a Sale: 15 units. FIFO should consume:
  // - 10 units from Batch 1 ($10.00 each)
  // - 5 units from Batch 2 ($15.00 each)
  // Total FIFO cost should be: 10 * 10 + 5 * 15 = $175.00.
  console.log("6. Creating sale (15 units)...");
  const saleRes = await fetch(`${BASE_URL}/sales/createSale`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      productId: product.id,
      quantity: 15
    }),
  });
  if (!saleRes.ok) throw new Error("Sale failed");
  console.log("✅ Sale event published.");

  // Wait 4 seconds for consumer to process sale
  console.log("⏳ Waiting 4 seconds for Kafka consumer to process sale...");
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 7. Check final dashboard stats
  console.log("7. Fetching final dashboard stats (Expected stock decrease: -15, cost decrease: -$175.00)...");
  const finalStatsRes = await fetch(`${BASE_URL}/dashboard/getStats`, { headers });
  const finalStatsData = await finalStatsRes.json() as any;
  console.log("📊 Final Dashboard Stats:", finalStatsData.data);

  // 8. Retrieve Ledger
  console.log("8. Retrieving ledger history...");
  const ledgerRes = await fetch(`${BASE_URL}/ledger/getLedger`, { headers });
  const ledgerData = await ledgerRes.json() as any;
  console.log("📋 Last 3 Ledger Entries:");
  console.log(JSON.stringify(ledgerData.data.slice(0, 3), null, 2));

  console.log("🎉 Integration test flow finished successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Integration test flow failed:", err);
  process.exit(1);
});
