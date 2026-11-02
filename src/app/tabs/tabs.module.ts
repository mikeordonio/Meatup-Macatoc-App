import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { TabsRedirectPage } from './tabs-redirect.page';
import { RoleFeaturePage } from '../features/navigation/role-feature.page';
import { AdminShopsPage } from '../features/shops/admin-shops.page';
import { ShopDirectoryPage } from '../features/shops/shop-directory.page';
import { ShopOwnerPage } from '../features/shops/shop-owner.page';
import { OwnerProductsPage } from '../features/products/owner-products.page';
import { CustomerOrdersPage } from '../features/orders/customer-orders.page';
import { OwnerOrdersPage } from '../features/orders/owner-orders.page';
import { OrdersPage } from '../features/orders/orders.page';
import { OrderConversationComponent } from '../features/orders/order-conversation.component';
import { ProfilePage } from '../features/profile/profile.page';
import { AdminDashboardPage } from '../features/admin/admin-dashboard.page';
import { AdminUsersPage } from '../features/admin/admin-users.page';
import { AdminOrderLogsPage } from '../features/admin/admin-order-logs.page';
import { NotificationsPage } from '../features/notifications/notifications.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
    TabsRedirectPage,
    RoleFeaturePage,
    ShopDirectoryPage,
    ShopOwnerPage,
    AdminShopsPage,
    OwnerProductsPage,
    CustomerOrdersPage,
    OwnerOrdersPage,
    OrdersPage,
    OrderConversationComponent,
    ProfilePage,
    AdminDashboardPage,
    AdminUsersPage,
    AdminOrderLogsPage,
    NotificationsPage,
  ]
})
export class TabsPageModule {}
