import { Routes } from '@angular/router';
import { mainGuard } from './core/routing/main-guard';
import { loginGuard } from './core/routing/login-guard';

export const routes: Routes = [
  {
    path: 'login',
    canMatch: [loginGuard],
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'main',
    canMatch: [mainGuard],
    loadComponent: () => import('./features/main/main').then((m) => m.Main),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
