import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Product, ProductCategory, ProductInput } from '../../core/models/product.model';
import { Shop } from '../../core/models/shop.model';
import { ProductService } from '../../core/services/product.service';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-owner-products',
  templateUrl: './owner-products.page.html',
  styleUrls: ['./owner-products.page.scss'],
  standalone: false,
})
export class OwnerProductsPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly shopService = inject(ShopService);

  readonly form = this.formBuilder.nonNullable.group({
    shopId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    category: ['pork' as ProductCategory, [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    pricePerKilogram: [0, [Validators.required, Validators.min(0.01)]],
    availableQuantityKg: [0, [Validators.required, Validators.min(0)]],
    imageBase64: ['', [Validators.maxLength(1000000)]],
    isAvailable: [true],
  });
  products: Product[] = [];
  shops: Shop[] = [];
  editingProductId: string | null = null;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  selectedImage: File | null = null;

  constructor() {
    void this.loadData();
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const input = this.form.getRawValue() as ProductInput;
    if (Math.round(input.availableQuantityKg * 4) !== input.availableQuantityKg * 4) {
      this.errorMessage = 'Available quantity must use 0.25 kg increments.';
      return;
    }

    this.isSubmitting = true;
    try {
      if (this.selectedImage) {
        input.imageBase64 = await this.productService.convertProductImageToBase64(this.selectedImage);
      }
      if (this.editingProductId) {
        await this.productService.updateProduct(this.editingProductId, input);
        this.successMessage = 'Product updated.';
      } else {
        await this.productService.createProduct(input);
        this.successMessage = 'Product added to the catalog.';
      }
      this.cancelEdit();
      await this.loadData();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to save the product.';
    } finally {
      this.isSubmitting = false;
    }

  }

  editProduct(product: Product): void {
    this.editingProductId = product.id;
    this.form.patchValue(product);
    this.errorMessage = '';
    this.successMessage = '';
  }

  selectImage(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    this.selectedImage = input.files?.[0] ?? null;
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.selectedImage = null;
    this.form.reset({
      shopId: this.shops[0]?.id ?? '',
      name: '',
      category: 'pork',
      description: '',
      pricePerKilogram: 0,
      availableQuantityKg: 0,
      imageBase64: '',
      isAvailable: true,
    });
  }

  isLowStock(product: Product): boolean {
    return product.availableQuantityKg > 0 && product.availableQuantityKg <= 1;
  }

  private async loadData(): Promise<void> {
    try {
      [this.shops, this.products] = await Promise.all([
        this.shopService.getOwnerShops(),
        this.productService.getOwnerProducts(),
      ]);
      if (!this.editingProductId && !this.form.controls.shopId.value) {
        this.form.controls.shopId.setValue(this.shops[0]?.id ?? '');
      }
    } catch {
      this.errorMessage = 'Unable to load products and shops.';
    }
  }
}
