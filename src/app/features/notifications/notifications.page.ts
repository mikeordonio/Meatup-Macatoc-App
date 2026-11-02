import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppNotification } from '../../core/models/notification.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private readonly subscription: Subscription;

  notifications: AppNotification[] = [];
  errorMessage = '';

  constructor() {
    this.subscription = this.notificationService.getNotifications().subscribe({
      next: (notifications) => this.notifications = notifications,
      error: () => this.errorMessage = 'Unable to load notifications.',
    });
  }

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.readAt).length;
  }

  async markRead(notification: AppNotification): Promise<void> {
    if (notification.readAt) {
      return;
    }
    try {
      await this.notificationService.markRead(notification.id);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to update notification.';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
