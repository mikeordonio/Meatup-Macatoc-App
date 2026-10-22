import { Component, inject } from '@angular/core';

import { Product, ProductCategory } from '../../core/models/product.model';
import { Shop } from '../../core/models/shop.model';
import { ShopService } from '../../core/services/shop.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-shop-directory',
  templateUrl: './shop-directory.page.html',
  styleUrls: ['./shop-directory.page.scss'],
  standalone: false,
})
export class ShopDirectoryPage {
  private readonly shopService = inject(ShopService);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  shops: Shop[] = [];
  products: Product[] = [];
  searchTerm = '';
  selectedCategory: ProductCategory | 'all' = 'all';
  errorMessage = '';
  selectedQuantities: Record<string, number> = {};

  constructor() {
    void this.loadShops();
  }

  private async loadShops(): Promise<void> {
    try {
      [this.shops, this.products] = await Promise.all([
        this.shopService.getApprovedShops(),
        this.productService.getAvailableProducts(),
      ]);
    } catch {
      this.errorMessage = 'Unable to load approved shops.';
    }
  }

  get filteredProducts(): Product[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const matchesCategory = this.selectedCategory === 'all'
        || product.category === this.selectedCategory;
      const matchesSearch = !search
        || product.name.toLowerCase().includes(search)
        || product.shopName.toLowerCase().includes(search)
        || product.description.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }

  addToCart(product: Product): void {
    try {
      this.cartService.add(product, this.selectedQuantities[product.id] ?? 0.25);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to add product to cart.';
    }
  }
}
