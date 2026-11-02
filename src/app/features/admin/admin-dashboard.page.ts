import { Component, inject } from '@angular/core';

import { AdminStatistics } from '../../core/models/admin.model';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false,
})
export class AdminDashboardPage {
  private readonly adminService = inject(AdminService);

  statistics: AdminStatistics | null = null;
  errorMessage = '';

  constructor() {
    void this.loadStatistics();
  }

  private async loadStatistics(): Promise<void> {
    try {
      this.statistics = await this.adminService.getStatistics();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to load administrator statistics.';
    }
  }
}
