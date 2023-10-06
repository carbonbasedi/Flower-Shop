export interface Order {
    id: number;
    userId: string;
    shippingAddress: ShippingAddress;
    orderDate: string;
    orderItems: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    orderStatus: string;
    total: number;
  }
  
  export interface OrderItem {
    productId: number;
    name: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }
  
  export interface ShippingAddress {
    fullname: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }