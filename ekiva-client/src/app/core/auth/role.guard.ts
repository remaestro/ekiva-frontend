import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (authService.hasAnyRole(requiredRoles)) {
      return true;
    } else {
      // User doesn't have required role, redirect to unauthorized page
      return router.createUrlTree(['/unauthorized']);
    }
  }

  return true;
};
