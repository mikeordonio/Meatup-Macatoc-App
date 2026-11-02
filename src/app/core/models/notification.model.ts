export type NotificationType =
  | 'newOrder'
  | 'orderStatus'
  | 'message'
  | 'lowStock'
  | 'shopDecision';

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  shopId?: string;
  productId?: string;
  createdAt: string;
  readAt?: string;
}
