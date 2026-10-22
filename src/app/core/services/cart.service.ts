import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  add(product: Product, quantityKg: number): void {
    this.validateQuantity(quantityKg);
    if (quantityKg > product.availableQuantityKg) {
      throw new Error('The requested quantity exceeds available stock.');
    }

    const items = [...this.items];
    const existing = items.find((item) => item.product.id === product.id);
    if (existing) {
      const nextQuantity = existing.quantityKg + quantityKg;
      if (nextQuantity > product.availableQuantityKg) {
        throw new Error('The requested quantity exceeds available stock.');
      }
      existing.quantityKg = nextQuantity;
    } else {
      items.push({ product, quantityKg });
    }
    this.itemsSubject.next(items);
  }

  update(productId: string, quantityKg: number): void {
    this.validateQuantity(quantityKg);
    const items = this.items
      .map((item) => item.product.id === productId ? { ...item, quantityKg } : item)
      .filter((item) => item.quantityKg > 0);
    this.itemsSubject.next(items);
  }

  remove(productId: string): void {
    this.itemsSubject.next(this.items.filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  totalForShop(shopId: string): number {
    return this.items
      .filter((item) => item.product.shopId === shopId)
      .reduce((total, item) => total + item.product.pricePerKilogram * item.quantityKg, 0);
  }

  private validateQuantity(quantityKg: number): void {
    if (quantityKg <= 0 || Math.round(quantityKg * 4) !== quantityKg * 4) {
      throw new Error('Order quantity must use 0.25 kg increments.');
    }
  }
}
