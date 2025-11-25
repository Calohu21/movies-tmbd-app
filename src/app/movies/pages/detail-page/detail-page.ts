import { Component, computed, inject, input } from '@angular/core';
import { CardDetail } from './components/card-detail/card-detail';
import { MoviesService } from '../../movies.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-detail-page',
  imports: [CardDetail],
  templateUrl: './detail-page.html',
  styles: ``,
})
export class DetailPage {
  moviesService = inject(MoviesService);
  movieId = input.required<string>();

  movieResource = rxResource({
    stream: () => this.moviesService.getMovieById(this.movieId()),
  });
  readonly movie = computed(this.movieResource.value);
}
