import { Routes } from '@angular/router';
import { HomePage } from './movies/pages/home-page/home-page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
