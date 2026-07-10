export interface PurchaseEventPayload {
  product_id: string;
  event_type: "purchase";
  quantity: number;
  unit_price: number;
  timestamp: string;
}

export interface SaleEventPayload {
  product_id: string;
  event_type: "sale";
  quantity: number;
  timestamp: string;
}

export type KafkaEventPayload = PurchaseEventPayload | SaleEventPayload;
