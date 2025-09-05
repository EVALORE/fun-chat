import { CanMatchFn, Router } from '@angular/router';
import { inject, untracked } from '@angular/core';
import { UserStore } from '../user-store';

export const mainGuard: CanMatchFn = () => {
  const user = inject(UserStore);
  const router = inject(Router);
  return untracked(() => user.isOnline()) ? true : router.createUrlTree(['login']);
};
