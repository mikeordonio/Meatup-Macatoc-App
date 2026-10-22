import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  standalone: false,
})
export class OrdersPage {
  readonly role = inject(AuthService).currentProfile?.role;
}
