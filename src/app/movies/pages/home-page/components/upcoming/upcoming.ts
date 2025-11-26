import { Component, inject } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { TrailerService } from '../../../../../shared/services/trailer.service';
import { MovieTrailer } from '../../../../../shared/components/movie-trailer/movie-trailer';

@Component({
  selector: 'app-upcoming',
  imports: [DatePipe, NgOptimizedImage, MovieTrailer],
  templateUrl: './upcoming.html',
  styles: `
    .scrollbar-hide {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }

    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `,
})
export class Upcoming {
  private readonly movieService = inject(MoviesService);
  readonly trailerService = inject(TrailerService);

  readonly movies$ = rxResource({
    stream: () => this.movieService.getUpcomingMovies(),
  });

  openTrailer(movieId: number, event: Event) {
    event.stopPropagation();
    this.trailerService.openTrailer(movieId);
  }

  closeTrailer() {
    this.trailerService.closeTrailer();
  }
}
