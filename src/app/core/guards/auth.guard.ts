import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForInitialization();
  return authService.currentProfile
    ? true
    : router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
};

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForInitialization();
  return authService.currentProfile ? router.createUrlTree(['/tabs']) : true;
};

export const roleGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForInitialization();
  const roles = route.data['roles'];
  if (Array.isArray(roles) && authService.hasRole(roles)) {
    return true;
  }

  const role = authService.currentProfile?.role;
  const fallback = role === 'shopOwner' || role === 'admin' ? 'dashboard' : 'home';
  return router.createUrlTree(['/tabs', fallback]);
};
