import { PoolClient } from "pg";
import { database } from "../../utils/database";
import { createPurchaseDto } from "./purchase.types";
import { publishEvent } from "../../kafka/producer";
import { TOPIC_INVENTORY_EVENTS } from "../../kafka/topics";

export const dbInsertPurchase = async (
  client: PoolClient,
  productCode: string,
  quantity: number,
  unitPrice: number,
) => {
  const result = await client.query(
    `
      INSERT INTO purchases
      (
        product_id,
        quantity,
        unit_price
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
    `,
    [productCode, quantity, unitPrice],
  );
  return result.rows[0];
};

export const createPurchase = async (purchaseData: createPurchaseDto) => {
  const { productId, quantity, unitPrice } = purchaseData;

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
    event_type: "purchase",
    quantity,
    unit_price: unitPrice,
    timestamp: new Date().toISOString(),
  };

  await publishEvent(TOPIC_INVENTORY_EVENTS, event);

  return {
    message: "Purchase event published to Kafka",
    event,
  };
};

export const getPurchases = async () => {
  const result = await database.query(
    `
      SELECT
        p.*,
        prod.product_name
      FROM purchases p
      JOIN products prod
      ON prod.product_id = p.product_id
      ORDER BY p.created_at DESC
    `,
  );

  return result.rows;
};
