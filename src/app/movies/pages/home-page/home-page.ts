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

  readonly topRatedMovies = computed(() => this.topRatedMoviesResource.value() ?? []);
  readonly popularMovies = computed(() => this.popularMoviesResource.value() ?? []);
  readonly mowPlayingMovies = computed(() => this.nowPlayingMoviesResource.value() ?? []);
  readonly upcomingMovies = computed(() => this.upcomingMoviesResource.value() ?? []);

  readonly upcomingMoviesResource = rxResource({
    stream: () => this.moviesService.getUpcomingMovies(),
  });

  readonly nowPlayingMoviesResource = rxResource({
    stream: () => this.moviesService.getNowPlayingMovies(),
  });

  readonly popularMoviesResource = rxResource({
    stream: () => this.moviesService.getPopularMovies(),
  });

  readonly topRatedMoviesResource = rxResource({
    stream: () => this.moviesService.getTopRatedMovies(),
  });
}
