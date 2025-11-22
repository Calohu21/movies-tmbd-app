import { Routes } from '@angular/router';
import { HomePage } from './movies/pages/home-page/home-page';
import { Layout } from './movies/pages/home-page/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: HomePage,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
