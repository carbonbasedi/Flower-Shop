export interface Basket {
  id: number;
  userId: string;
  items: BasketItem[];
  paymentIntentId?: string;
  clientSecret?: string;
}

export interface BasketItem {
  productId: number;
  name: string;
  price: number;
  discount: number;
  discountedPrice: number;
  pictureUrl: string;
  brand: string;
  type: string;
  quantity: number;
}
