import { Component, inject } from '@angular/core';
import { MoviesService } from '../../../../movies.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class Hero {
  trendingMoviesResource = inject(MoviesService).trendingMoviesResource;
}
