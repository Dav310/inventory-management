export interface createSaleDto {
  productId: number;
  quantity: number;
}

export interface Sale {
  id: number;
  product_id: string;
  quantity: number;
  total_cost: number;
  created_at: Date;
}
