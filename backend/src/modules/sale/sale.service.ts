import { PoolClient } from "pg";
import { database } from "../../utils/database";
import { createSaleDto } from "./sale.types.ts";
import { publishEvent } from "../../kafka/producer.ts";
import { TOPIC_INVENTORY_EVENTS } from "../../kafka/topics.ts";


export const dbInsertSale = async (
  client: PoolClient,
  productCode: string,
  quantity: number,
  totalCost: number,
) => {
  const result = await client.query(
    `
      INSERT INTO sales
      (
        product_id,
        quantity,
        total_cost
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
    `,
    [productCode, quantity, totalCost],
  );
  return result.rows[0];
};

export const createSale = async (saleData: createSaleDto) => {
  const { productId, quantity } = saleData;

  const productResult = await database.query(
    "SELECT * FROM products WHERE id = $1",
    [productId],
  );

  if (productResult.rows.length === 0) {
    throw new Error("Product not found");
  }

  const product = productResult.rows[0];

  const event = {
    product_id: product.product_id,
    event_type: "sale",
    quantity,
    timestamp: new Date().toISOString(),
  };

  await publishEvent(TOPIC_INVENTORY_EVENTS, event);

  return {
    message: "Sale event published successfully",
    event,
  };
};

export const getSales = async () => {
  const result = await database.query(
    `
      SELECT
        s.*,
        p.product_name
      FROM sales s
      JOIN products p
      ON p.product_id = s.product_id
      ORDER BY s.created_at DESC
    `,
  );

  return result.rows;
};
