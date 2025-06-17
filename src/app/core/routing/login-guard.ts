import { CanMatchFn, Router } from '@angular/router';
import { inject, untracked } from '@angular/core';
import { UserStore } from '../user-store';

export const loginGuard: CanMatchFn = () => {
  const user = inject(UserStore);
  const router = inject(Router);
  return untracked(user.isLogged) ? router.createUrlTree(['']) : true;
};
