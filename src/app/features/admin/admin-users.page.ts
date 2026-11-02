import { Component, inject } from '@angular/core';

import { AdminUserRecord } from '../../core/models/admin.model';
import { AccountStatus } from '../../core/models/user-profile.model';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: false,
})
export class AdminUsersPage {
  private readonly adminService = inject(AdminService);

  users: AdminUserRecord[] = [];
  errorMessage = '';
  updatingUserId: string | null = null;

  constructor() {
    void this.loadUsers();
  }

  async updateStatus(user: AdminUserRecord, status: AccountStatus): Promise<void> {
    this.errorMessage = '';
    this.updatingUserId = user.uid;
    try {
      await this.adminService.updateUserStatus(user.uid, status);
      user.status = status;
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to update account status.';
    } finally {
      this.updatingUserId = null;
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      this.users = await this.adminService.getUsers();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to load users.';
    }
  }
}
