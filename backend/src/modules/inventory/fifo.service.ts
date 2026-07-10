import { PoolClient } from "pg";

/**
 * Executes the FIFO inventory costing algorithm on the active inventory batches.
 * This function should run within a PostgreSQL transaction.
 * 
 * @param client The PostgreSQL PoolClient transaction instance.
 * @param productCode The alphanumeric product code (product_id).
 * @param quantity The quantity of product to sell.
 * @returns The total cost calculated using FIFO.
 */
export const executeFIFO = async (
  client: PoolClient,
  productCode: string,
  quantity: number,
): Promise<number> => {
  // 1. Fetch active inventory batches (oldest first)
  const batchesResult = await client.query(
    `
      SELECT * FROM inventory_batch
      WHERE product_id = $1 AND remaining_quantity > 0
      ORDER BY created_at ASC
    `,
    [productCode],
  );

  const activeBatches = batchesResult.rows;

  // 2. Verify total stock is sufficient
  const totalStock = activeBatches.reduce(
    (sum, batch) => sum + Number(batch.remaining_quantity),
    0,
  );

  if (totalStock < quantity) {
    throw new Error(
      `Insufficient inventory for product "${productCode}". Available: ${totalStock}, Requested: ${quantity}`
    );
  }

  // 3. Consume stock using FIFO costing
  let remainingToConsume = quantity;
  let totalCost = 0;

  for (const batch of activeBatches) {
    if (remainingToConsume <= 0) break;

    const batchRemaining = Number(batch.remaining_quantity);
    const batchUnitPrice = Number(batch.unit_price);

    if (batchRemaining >= remainingToConsume) {
      // This batch has enough to fulfill the remaining order
      const updatedRemaining = batchRemaining - remainingToConsume;
      totalCost += remainingToConsume * batchUnitPrice;

      await client.query(
        `
          UPDATE inventory_batch
          SET remaining_quantity = $1
          WHERE id = $2
        `,
        [updatedRemaining, batch.id],
      );

      remainingToConsume = 0;
    } else {
      // Consume this batch entirely and move to next
      totalCost += batchRemaining * batchUnitPrice;
      remainingToConsume -= batchRemaining;

      await client.query(
        `
          UPDATE inventory_batch
          SET remaining_quantity = 0
          WHERE id = $1
        `,
        [batch.id],
      );
    }
  }

  return totalCost;
};
