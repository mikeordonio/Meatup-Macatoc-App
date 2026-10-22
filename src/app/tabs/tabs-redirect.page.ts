import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tabs-redirect',
  template: '',
  standalone: false,
})
export class TabsRedirectPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    const role = this.authService.currentProfile?.role;
    const defaultPath = role === 'customer' ? 'home' : 'dashboard';
    void this.router.navigate(['/tabs', defaultPath], { replaceUrl: true });
  }
}
