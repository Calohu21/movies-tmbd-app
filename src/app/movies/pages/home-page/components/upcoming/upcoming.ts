import { Component, inject } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upcoming',
  imports: [DatePipe],
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
  private movieService = inject(MoviesService);

  movies$ = rxResource({
    stream: () => this.movieService.getUpcomingMovies(),
  });
}
