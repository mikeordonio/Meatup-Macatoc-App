import { OrderStatus, OrderStatusHistoryEntry } from './order.model';
import { AccountStatus, UserRole } from './user-profile.model';

export interface AdminUserRecord {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderLog {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  shopOwnerId: string;
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedAt: string;
  actorId: string;
  actorName: string;
  description: string;
}

export interface AdminStatistics {
  totalUsers: number;
  customers: number;
  shopOwners: number;
  activeUsers: number;
  suspendedUsers: number;
  totalShops: number;
  pendingShops: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface OrderHistoryView extends OrderStatusHistoryEntry {
  orderId: string;
  customerName: string;
  shopName: string;
}
