import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CartItem } from '../../core/models/cart.model';
import { Order } from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.page.html',
  styleUrls: ['./customer-orders.page.scss'],
  standalone: false,
})
export class CustomerOrdersPage implements OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly unreadSubscriptions: Subscription[] = [];

  readonly form = this.formBuilder.nonNullable.group({
    fulfillmentMethod: ['pickup' as Order['fulfillmentMethod'], [Validators.required]],
    fulfillmentDetails: ['', [Validators.required, Validators.maxLength(300)]],
  });
  cart: CartItem[] = [];
  orders: Order[] = [];
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  selectedOrder: Order | null = null;
  unreadCounts: Record<string, number> = {};

  constructor() {
    this.cartService.items$.subscribe((items) => this.cart = items);
    void this.loadOrders();
  }

  get cartTotal(): number {
    return this.cart.reduce((total, item) => total + item.quantityKg * item.product.pricePerKilogram, 0);
  }

  updateQuantity(item: CartItem, quantityKg: number): void {
    try {
      this.cartService.update(item.product.id, quantityKg);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to update quantity.';
    }
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.product.id);
  }

  async checkout(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid || !this.cart.length) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Add items and complete fulfillment details before checkout.';
      return;
    }

    this.isSubmitting = true;
    try {
      const values = this.form.getRawValue();
      const orders = await this.orderService.checkout(values.fulfillmentMethod, values.fulfillmentDetails);
      this.successMessage = `${orders.length} order${orders.length === 1 ? '' : 's'} submitted successfully.`;
      await this.loadOrders();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to submit your order.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async cancel(order: Order): Promise<void> {
    try {
      await this.orderService.cancelOrder(order.id);
      order.status = 'cancelled';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to cancel the order.';
    }
  }

  openConversation(order: Order): void {
    this.selectedOrder = this.selectedOrder?.id === order.id ? null : order;
  }

  private async loadOrders(): Promise<void> {
    try {
      this.orders = await this.orderService.getCustomerOrders();
      this.unreadSubscriptions.forEach((subscription) => subscription.unsubscribe());
      this.orders.forEach((order) => {
        this.unreadSubscriptions.push(this.messageService.getUnreadCount(order).subscribe({
          next: (count) => this.unreadCounts[order.id] = count,
        }));
      });
    } catch {
      this.errorMessage = 'Unable to load your order history.';
    }
  }

  ngOnDestroy(): void {
    this.unreadSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
