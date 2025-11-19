import { Component, inject } from '@angular/core';
import { MoviesService } from '../../movies.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage {
  movieService = inject(MoviesService);

  trendingMoviesDay = rxResource({
    stream: () => this.movieService.getTrendingMovies(),
  });
}
