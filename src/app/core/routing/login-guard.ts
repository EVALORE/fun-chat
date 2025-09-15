import { CanMatchFn, Router } from '@angular/router';
import { inject, untracked } from '@angular/core';
import { UserStore } from '../stores/user-store';

export const loginGuard: CanMatchFn = () => {
  const user = inject(UserStore);
  const router = inject(Router);
  return untracked(() => user.isOnline()) ? router.createUrlTree(['']) : true;
};
