import { Component, inject } from '@angular/core';

import { AuthService } from '../core/services/auth.service';
import { UserRole } from '../core/models/user-profile.model';

export interface TabNavigationItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  private readonly authService = inject(AuthService);

  readonly profile$ = this.authService.profile$;

  get navigationItems(): TabNavigationItem[] {
    switch (this.authService.currentProfile?.role) {
      case 'shopOwner':
        return [
          { label: 'Dashboard', path: 'dashboard', icon: 'grid-outline', roles: ['shopOwner'] },
          { label: 'Products', path: 'products', icon: 'cube-outline', roles: ['shopOwner'] },
          { label: 'Orders', path: 'orders', icon: 'receipt-outline', roles: ['shopOwner'] },
          { label: 'Profile', path: 'profile', icon: 'person-outline', roles: ['shopOwner'] },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: 'admin-dashboard', icon: 'grid-outline', roles: ['admin'] },
          { label: 'Users', path: 'users', icon: 'people-outline', roles: ['admin'] },
          { label: 'Shops', path: 'admin-shops', icon: 'business-outline', roles: ['admin'] },
          { label: 'Order Logs', path: 'order-logs', icon: 'list-outline', roles: ['admin'] },
          { label: 'Profile', path: 'profile', icon: 'person-outline', roles: ['admin'] },
        ];
      default:
        return [
          { label: 'Home', path: 'home', icon: 'home-outline', roles: ['customer'] },
          { label: 'Shops', path: 'shops', icon: 'storefront-outline', roles: ['customer'] },
          { label: 'Orders', path: 'orders', icon: 'receipt-outline', roles: ['customer'] },
          { label: 'Profile', path: 'profile', icon: 'person-outline', roles: ['customer'] },
        ];
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
