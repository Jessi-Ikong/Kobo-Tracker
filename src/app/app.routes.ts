import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/dashboard/dashboard').then((module) => module.Dashboard),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions/transactions').then((module) => module.Transactions),
  },
  { path: '**', redirectTo: '' },
];
