import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order, OrderStatus } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-owner-orders',
  templateUrl: './owner-orders.page.html',
  styleUrls: ['./owner-orders.page.scss'],
  standalone: false,
})
export class OwnerOrdersPage implements OnDestroy {
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);
  private readonly unreadSubscriptions: Subscription[] = [];
  orders: Order[] = [];
  errorMessage = '';
  updatingOrderId: string | null = null;
  selectedOrder: Order | null = null;
  unreadCounts: Record<string, number> = {};

  constructor() {
    void this.loadOrders();
  }

  async updateStatus(order: Order, status: OrderStatus): Promise<void> {
    this.updatingOrderId = order.id;
    try {
      await this.orderService.updateStatus(order.id, status);
      order.status = status;
    } catch {
      this.errorMessage = 'Unable to update the order status.';
    } finally {
      this.updatingOrderId = null;
    }
  }

  openConversation(order: Order): void {
    this.selectedOrder = this.selectedOrder?.id === order.id ? null : order;
  }

  private async loadOrders(): Promise<void> {
    try {
      this.orders = await this.orderService.getOwnerOrders();
      this.unreadSubscriptions.forEach((subscription) => subscription.unsubscribe());
      this.orders.forEach((order) => {
        this.unreadSubscriptions.push(this.messageService.getUnreadCount(order).subscribe({
          next: (count) => this.unreadCounts[order.id] = count,
        }));
      });
    } catch {
      this.errorMessage = 'Unable to load incoming orders.';
    }
  }

  ngOnDestroy(): void {
    this.unreadSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
