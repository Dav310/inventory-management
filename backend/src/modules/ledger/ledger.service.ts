import { PoolClient } from "pg";
import { database } from "../../utils/database";


export const dbInsertLedger = async (
  client: PoolClient,
  productCode: string,
  transactionType: "purchase" | "sale",
  quantity: number,
  unitPrice: number | null,
  totalCost: number,
) => {
  const result = await client.query(
    `
      INSERT INTO inventory_ledger
      (
        product_id,
        transaction_type,
        quantity,
        unit_price,
        total_cost
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
    `,
    [productCode, transactionType, quantity, unitPrice, totalCost],
  );
  return result.rows[0];
};

export const getLedger = async () => {
  const result = await database.query(
    `
      SELECT
        il.*,
        p.product_name
      FROM inventory_ledger il
      JOIN products p
      ON p.product_id = il.product_id
      ORDER BY il.created_at DESC
    `,
  );

  return result.rows;
};
