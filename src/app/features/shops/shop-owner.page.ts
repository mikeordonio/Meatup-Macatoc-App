import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Shop, ShopInput } from '../../core/models/shop.model';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-shop-owner',
  templateUrl: './shop-owner.page.html',
  styleUrls: ['./shop-owner.page.scss'],
  standalone: false,
})
export class ShopOwnerPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly shopService = inject(ShopService);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    serviceArea: ['', [Validators.required, Validators.maxLength(100)]],
    contactNumber: ['', [Validators.required, Validators.maxLength(30)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    imageUrl: ['', [Validators.maxLength(500)]],
  });
  shops: Shop[] = [];
  editingShopId: string | null = null;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor() {
    void this.loadShops();
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    try {
      const input: ShopInput = this.form.getRawValue();
      if (this.editingShopId) {
        await this.shopService.updateShop(this.editingShopId, input);
        this.successMessage = 'Shop details updated.';
      } else {
        await this.shopService.createShop(input);
        this.successMessage = 'Shop submitted for administrator review.';
      }
      this.cancelEdit();
      await this.loadShops();
    } catch (error) {
      this.errorMessage = error instanceof Error
        ? error.message
        : 'Unable to save the shop. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  editShop(shop: Shop): void {
    this.editingShopId = shop.id;
    this.form.patchValue(shop);
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingShopId = null;
    this.form.reset();
  }

  get canRegisterShop(): boolean {
    return this.shops.length === 0;
  }

  private async loadShops(): Promise<void> {
    try {
      this.shops = await this.shopService.getOwnerShops();
    } catch {
      this.errorMessage = 'Unable to load your shops.';
    }
  }
}
