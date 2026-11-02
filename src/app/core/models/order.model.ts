export type FulfillmentMethod = 'pickup' | 'delivery';
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'processing'
  | 'readyForPickup'
  | 'forDelivery'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  quantityKg: number;
  pricePerKilogram: number;
  subtotal: number;
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  changedAt: string;
  actorId: string;
  actorName: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  shopOwnerId: string;
  items: OrderItem[];
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentDetails: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory?: OrderStatusHistoryEntry[];
}
