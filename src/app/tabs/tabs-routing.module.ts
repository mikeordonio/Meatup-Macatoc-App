import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { RoleFeaturePage } from '../features/navigation/role-feature.page';
import { TabsRedirectPage } from './tabs-redirect.page';
import { TabsPage } from './tabs.page';
import { UserRole } from '../core/models/user-profile.model';
import { AdminShopsPage } from '../features/shops/admin-shops.page';
import { ShopDirectoryPage } from '../features/shops/shop-directory.page';
import { OwnerProductsPage } from '../features/products/owner-products.page';
import { OrdersPage } from '../features/orders/orders.page';
import { ProfilePage } from '../features/profile/profile.page';
import { AdminDashboardPage } from '../features/admin/admin-dashboard.page';
import { AdminUsersPage } from '../features/admin/admin-users.page';
import { AdminOrderLogsPage } from '../features/admin/admin-order-logs.page';

const customerRoles: UserRole[] = ['customer'];
const shopOwnerRoles: UserRole[] = ['shopOwner'];
const adminRoles: UserRole[] = ['admin'];
const customerAndShopOwnerRoles: UserRole[] = ['customer', 'shopOwner'];
const allRoles: UserRole[] = ['customer', 'shopOwner', 'admin'];

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: RoleFeaturePage,
        canActivate: [authGuard],
        data: { roles: customerRoles, title: 'Home', description: 'Discover local pork and chicken shops in Macatoc.', icon: 'home-outline' }
      },
      {
        path: 'shops',
        component: ShopDirectoryPage,
        canActivate: [authGuard],
        data: { roles: customerRoles, title: 'Shops', description: 'Browse approved shops and their available products.', icon: 'storefront-outline' }
      },
      {
        path: 'orders',
        component: OrdersPage,
        canActivate: [authGuard],
        data: { roles: customerAndShopOwnerRoles, title: 'Orders', description: 'Track customer orders and keep order activity organized.', icon: 'receipt-outline' }
      },
      {
        path: 'dashboard',
        component: RoleFeaturePage,
        canActivate: [authGuard],
        data: { roles: shopOwnerRoles, title: 'Dashboard', description: 'Review shop activity and manage daily operations.', icon: 'grid-outline' }
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardPage,
        canActivate: [authGuard],
        data: { roles: adminRoles, title: 'Dashboard', description: 'Review platform activity and administrative tasks.', icon: 'grid-outline' }
      },
      {
        path: 'products',
        component: OwnerProductsPage,
        canActivate: [authGuard],
        data: { roles: shopOwnerRoles, title: 'Products', description: 'Manage your shop catalog and inventory.', icon: 'cube-outline' }
      },
      {
        path: 'users',
        component: AdminUsersPage,
        canActivate: [authGuard],
        data: { roles: adminRoles, title: 'Users', description: 'Monitor registered accounts and account statuses.', icon: 'people-outline' }
      },
      {
        path: 'admin-shops',
        component: AdminShopsPage,
        canActivate: [authGuard],
        data: { roles: adminRoles, title: 'Shops', description: 'Review shop applications and manage shop status.', icon: 'business-outline' }
      },
      {
        path: 'order-logs',
        component: AdminOrderLogsPage,
        canActivate: [authGuard],
        data: { roles: adminRoles, title: 'Order Logs', description: 'Review platform-wide order activity and status history.', icon: 'list-outline' }
      },
      {
        path: 'profile',
        component: ProfilePage,
        canActivate: [authGuard],
        data: { roles: allRoles, title: 'Profile', description: 'View your account information and role.', icon: 'person-outline' }
      },
      {
        path: '',
        component: TabsRedirectPage,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
