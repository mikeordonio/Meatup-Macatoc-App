import { Component, inject } from '@angular/core';

import { Shop, ShopStatus } from '../../core/models/shop.model';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-shops',
  templateUrl: './admin-shops.page.html',
  styleUrls: ['./admin-shops.page.scss'],
  standalone: false,
})
export class AdminShopsPage {
  private readonly shopService = inject(ShopService);

  shops: Shop[] = [];
  errorMessage = '';
  updatingShopId: string | null = null;

  constructor() {
    void this.loadShops();
  }

  async updateStatus(shop: Shop, status: ShopStatus): Promise<void> {
    this.errorMessage = '';
    this.updatingShopId = shop.id;
    try {
      await this.shopService.updateStatus(shop.id, status);
      shop.status = status;
    } catch {
      this.errorMessage = 'Unable to update the shop status.';
    } finally {
      this.updatingShopId = null;
    }
  }

  private async loadShops(): Promise<void> {
    try {
      this.shops = await this.shopService.getAllShops();
    } catch {
      this.errorMessage = 'Unable to load shop applications.';
    }
  }
}
