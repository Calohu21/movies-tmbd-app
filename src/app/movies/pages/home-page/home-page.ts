import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Hero } from './components/hero/hero';
import { RouterOutlet } from '@angular/router';
import { Upcoming } from './components/upcoming/upcoming';
import { MovieCarousel } from '../../../shared/components/movie-carousel/movie-carousel';
import { MoviesService } from '../../movies.service';

@Component({
  selector: 'app-home-page',
  imports: [Hero, RouterOutlet, Upcoming, MovieCarousel],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage {
  private readonly moviesService = inject(MoviesService);

  readonly upcomingMoviesResource = rxResource({
    stream: () => this.moviesService.getUpcomingMovies(),
  });

  readonly upcomingMovies = computed(() => this.upcomingMoviesResource.value() ?? []);
}
