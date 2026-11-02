import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { AdminStatistics, AdminUserRecord, OrderHistoryView } from '../models/admin.model';
import { Order } from '../models/order.model';
import { AccountStatus } from '../models/user-profile.model';
import { AuthService } from './auth.service';
import { firestore } from './firebase';
import { ShopService } from './shop.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);

  async getUsers(): Promise<AdminUserRecord[]> {
    this.requireAdmin();
    const snapshot = await getDocs(query(collection(firestore, 'users'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((item) => ({ uid: item.id, ...item.data() }) as AdminUserRecord);
  }

  async updateUserStatus(userId: string, status: AccountStatus): Promise<void> {
    const admin = this.requireAdmin();
    if (userId === admin.uid) {
      throw new Error('You cannot suspend your own administrator account.');
    }
    await updateDoc(doc(firestore, 'users', userId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  async getOrders(): Promise<Order[]> {
    this.requireAdmin();
    const snapshot = await getDocs(query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Order);
  }

  async getOrderHistory(): Promise<OrderHistoryView[]> {
    const orders = await this.getOrders();
    return orders.flatMap((order) => (order.statusHistory ?? [{
      status: order.status,
      changedAt: order.updatedAt,
      actorId: order.customerId,
      actorName: order.customerName,
    }]).map((entry) => ({
      ...entry,
      orderId: order.id,
      customerName: order.customerName,
      shopName: order.shopName,
    }))).sort((left, right) => right.changedAt.localeCompare(left.changedAt));
  }

  async getStatistics(): Promise<AdminStatistics> {
    const [users, shops, orders] = await Promise.all([
      this.getUsers(),
      this.shopService.getAllShops(),
      this.getOrders(),
    ]);
    return {
      totalUsers: users.length,
      customers: users.filter((user) => user.role === 'customer').length,
      shopOwners: users.filter((user) => user.role === 'shopOwner').length,
      activeUsers: users.filter((user) => user.status === 'active').length,
      suspendedUsers: users.filter((user) => user.status === 'suspended').length,
      totalShops: shops.length,
      pendingShops: shops.filter((shop) => shop.status === 'pending').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === 'pending').length,
      completedOrders: orders.filter((order) => order.status === 'completed').length,
      totalRevenue: orders
        .filter((order) => order.status !== 'cancelled' && order.status !== 'rejected')
        .reduce((total, order) => total + order.total, 0),
    };
  }

  private requireAdmin() {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'admin') {
      throw new Error('Only administrators can access this data.');
    }
    return profile;
  }
}
