import { Routes } from '@angular/router';
import { HomePage } from './movies/pages/home-page/home-page';
import { DetailPage } from './movies/pages/detail-page/detail-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'detail-movie',
    component: DetailPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
