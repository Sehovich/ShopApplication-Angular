import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../features/auth/store/auth.store';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!AuthStore.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
