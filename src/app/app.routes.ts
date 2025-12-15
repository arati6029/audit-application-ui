import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.routes').then((m) => m.PAGES_ROUTES),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
];
