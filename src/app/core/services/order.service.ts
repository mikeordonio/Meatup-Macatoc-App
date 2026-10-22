import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
} from 'firebase/firestore';

import { CartItem } from '../models/cart.model';
import { Order, OrderStatus } from '../models/order.model';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  async checkout(
    fulfillmentMethod: Order['fulfillmentMethod'],
    fulfillmentDetails: string,
  ): Promise<Order[]> {
    const profile = this.authService.currentProfile;
    const items = this.cartService.items;
    if (!profile || profile.role !== 'customer') {
      throw new Error('Only customers can submit orders.');
    }
    if (!items.length || !fulfillmentDetails.trim()) {
      throw new Error('Add products and fulfillment details before checkout.');
    }

    const grouped = this.groupByShop(items);
    const orders: Order[] = [];
    for (const shopItems of grouped.values()) {
      orders.push(await this.createTransactionalOrder(
        profile.uid,
        profile.name,
        shopItems,
        fulfillmentMethod,
        fulfillmentDetails.trim(),
      ));
    }
    this.cartService.clear();
    return orders;
  }

  async getCustomerOrders(): Promise<Order[]> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'customer') {
      return [];
    }
    const snapshot = await getDocs(query(
      collection(firestore, 'orders'),
      where('customerId', '==', profile.uid),
      orderBy('createdAt', 'desc'),
    ));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Order);
  }

  async getOwnerOrders(): Promise<Order[]> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      return [];
    }
    const snapshot = await getDocs(query(
      collection(firestore, 'orders'),
      where('shopOwnerId', '==', profile.uid),
      orderBy('createdAt', 'desc'),
    ));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Order);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      throw new Error('Only shop owners can update order status.');
    }
    await updateDoc(doc(firestore, 'orders', orderId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  async cancelOrder(orderId: string): Promise<void> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'customer') {
      throw new Error('Only customers can cancel orders.');
    }
    await runTransaction(firestore, async (transaction) => {
      const orderReference = doc(firestore, 'orders', orderId);
      const orderSnapshot = await transaction.get(orderReference);
      if (!orderSnapshot.exists()) {
        throw new Error('Order was not found.');
      }
      const order = orderSnapshot.data() as Order;
      if (order.customerId !== profile.uid || order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled.');
      }

      const productReferences = order.items.map((item) => doc(firestore, 'products', item.productId));
      const productSnapshots = await Promise.all(
        productReferences.map((reference) => transaction.get(reference)),
      );
      productSnapshots.forEach((snapshot, index) => {
        if (!snapshot.exists()) {
          throw new Error('A product from this order no longer exists.');
        }
        const available = Number(snapshot.data()['availableQuantityKg']);
        transaction.update(productReferences[index], {
          availableQuantityKg: available + order.items[index].quantityKg,
          isAvailable: true,
          updatedAt: new Date().toISOString(),
        });
      });
      transaction.update(orderReference, {
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      });
    });
  }

  private async createTransactionalOrder(
    customerId: string,
    customerName: string,
    items: CartItem[],
    fulfillmentMethod: Order['fulfillmentMethod'],
    fulfillmentDetails: string,
  ): Promise<Order> {
    const firstProduct = items[0].product;
    const orderReference = doc(collection(firestore, 'orders'));
    const timestamp = new Date().toISOString();
    const order = await runTransaction(firestore, async (transaction) => {
      const productReferences = items.map((item) => doc(firestore, 'products', item.product.id));
      const snapshots = await Promise.all(productReferences.map((reference) => transaction.get(reference)));
      const orderItems: Order['items'] = [];
      const firstSnapshot = snapshots[0];
      if (!firstSnapshot?.exists()) {
        throw new Error('A product in your cart is no longer available.');
      }

      snapshots.forEach((snapshot, index) => {
        if (!snapshot.exists()) {
          throw new Error('A product in your cart is no longer available.');
        }
        const data = snapshot.data();
        const item = items[index];
        const available = Number(data['availableQuantityKg']);
        const price = Number(data['pricePerKilogram']);
        if (data['isAvailable'] !== true || available < item.quantityKg) {
          throw new Error(`Insufficient stock for ${data['name']}.`);
        }
        if (price !== item.product.pricePerKilogram) {
          throw new Error(`The price for ${data['name']} changed. Refresh and try again.`);
        }
        transaction.update(productReferences[index], {
          availableQuantityKg: available - item.quantityKg,
          isAvailable: available - item.quantityKg > 0,
          updatedAt: timestamp,
        });
        orderItems.push({
          productId: item.product.id,
          name: String(data['name']),
          category: String(data['category']),
          quantityKg: item.quantityKg,
          pricePerKilogram: price,
          subtotal: price * item.quantityKg,
        });
      });

      const orderData = {
        customerId,
        customerName,
        shopId: firstProduct.shopId,
        shopName: String(firstSnapshot.data()['shopName']),
        shopOwnerId: String(firstSnapshot.data()['ownerId']),
        items: orderItems,
        fulfillmentMethod,
        fulfillmentDetails,
        total: orderItems.reduce((total, item) => total + item.subtotal, 0),
        status: 'pending' as OrderStatus,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      transaction.set(orderReference, orderData);
      return { id: orderReference.id, ...orderData } as Order;
    });
    return order;
  }

  private groupByShop(items: CartItem[]): Map<string, CartItem[]> {
    const grouped = new Map<string, CartItem[]>();
    items.forEach((item) => {
      const shopItems = grouped.get(item.product.shopId) ?? [];
      shopItems.push(item);
      grouped.set(item.product.shopId, shopItems);
    });
    return grouped;
  }
}
