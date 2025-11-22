import { Component, inject } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upcoming',
  imports: [DatePipe],
  templateUrl: './upcoming.html',
})
export class Upcoming {
  movieService = inject(MoviesService);

  movies$ = rxResource({
    stream: () => this.movieService.getUpcomingMovies(),
  });
}
