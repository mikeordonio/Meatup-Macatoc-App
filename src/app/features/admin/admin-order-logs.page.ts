import { Component, inject } from '@angular/core';

import { OrderHistoryView } from '../../core/models/admin.model';
import { OrderStatus } from '../../core/models/order.model';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-order-logs',
  templateUrl: './admin-order-logs.page.html',
  styleUrls: ['./admin-order-logs.page.scss'],
  standalone: false,
})
export class AdminOrderLogsPage {
  private readonly adminService = inject(AdminService);

  logs: OrderHistoryView[] = [];
  filteredLogs: OrderHistoryView[] = [];
  searchTerm = '';
  statusFilter: OrderStatus | 'all' = 'all';
  errorMessage = '';

  constructor() {
    void this.loadLogs();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredLogs = this.logs.filter((log) => {
      const matchesSearch = !term
        || log.orderId.toLowerCase().includes(term)
        || log.customerName.toLowerCase().includes(term)
        || log.shopName.toLowerCase().includes(term);
      return matchesSearch && (this.statusFilter === 'all' || log.status === this.statusFilter);
    });
  }

  private async loadLogs(): Promise<void> {
    try {
      this.logs = await this.adminService.getOrderHistory();
      this.applyFilters();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to load order logs.';
    }
  }
}
