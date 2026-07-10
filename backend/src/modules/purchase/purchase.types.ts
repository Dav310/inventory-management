export interface createPurchaseDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Purchase{
  id:number,
  productId:number,
  quantity:number,
  remainingQuantity:number,
  unitPrice:number,
  createdAt:Date,
}

