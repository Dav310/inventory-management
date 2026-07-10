import { PoolClient } from "pg";
import { database } from "../../utils/database.ts";

/**
 * Inserts a new inventory batch record inside the database.
 * This should run inside a PostgreSQL transaction.
 */
export const dbInsertInventoryBatch = async (
  client: PoolClient,
  productCode: string,
  quantity: number,
  unitPrice: number,
) => {
  const result = await client.query(
    `
      INSERT INTO inventory_batch
      (
        product_id,
        quantity,
        remaining_quantity,
        unit_price
      )
      VALUES
      (
        $1,
        $2,
        $2,
        $3
      )
      RETURNING *
    `,
    [productCode, quantity, unitPrice],
  );
  return result.rows[0];
};

/**
 * Retrieves all inventory batches joined with product details.
 */
export const getInventory = async () => {
  const result = await database.query(
    `
      SELECT
        ib.*,
        p.product_name
      FROM inventory_batch ib
      JOIN products p
      ON p.product_id = ib.product_id
      ORDER BY ib.created_at DESC
    `,
  );
  return result.rows;
};
