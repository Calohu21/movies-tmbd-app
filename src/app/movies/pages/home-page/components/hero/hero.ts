import {
  Component,
  computed,
  inject,
  signal,
  effect,
  PLATFORM_ID,
  untracked,
  DestroyRef,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MoviesService } from '../../../../movies.service';
import { Movie } from '../../../../../core/models/movie.interface';
import { MovieTrailer } from '../../../../../shared/components/movie-trailer/movie-trailer';
import { RouterLink } from '@angular/router';
import { TrailerService } from '../../../../../shared/services/trailer.service';
import { TmdbImagePipe } from '../../../../../shared/pipes/tmdb-image.pipe';

@Component({
  selector: 'app-hero',
  imports: [MovieTrailer, NgOptimizedImage, RouterLink, TmdbImagePipe],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnDestroy {
  private readonly movieService = inject(MoviesService);
  readonly trailerService = inject(TrailerService);
  private readonly platformId = inject(PLATFORM_ID);

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_PLAY_INTERVAL = 8000; // 8 segundos
  private readonly isPaused = signal<boolean>(false);
  private readonly totalMovies = computed<number>(() => this.movies().length);
  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly currentIndex = signal<number>(0);
  readonly previousIndex = signal<number>(-1);
  readonly slideDirection = signal<'next' | 'prev'>('next');
  readonly isTransitioning = signal<boolean>(false);
  readonly moviesWithTrailer = signal<Set<number>>(new Set());
  readonly movies = computed<Movie[]>(() => {
    if (this.heroDataResource.error()) {
      return [];
    }
    return this.heroDataResource.value() ?? [];
  });

  readonly heroDataResource = rxResource({
    stream: () => this.movieService.getTrendingMovies(),
  });

  readonly currentMovieHasTrailer = computed<boolean>(() => {
    const moviesList = this.movies();
    const index = this.currentIndex();
    if (moviesList.length === 0) return false;
    const currentMovie = moviesList[index];
    return currentMovie ? this.moviesWithTrailer().has(currentMovie.id) : false;
  });

  readonly prevIndex = computed<number>(() => {
    const total = this.totalMovies();
    const current = this.currentIndex();
    if (total === 0) return 0;
    return current === 0 ? total - 1 : current - 1;
  });

  readonly nextIndex = computed<number>(() => {
    const total = this.totalMovies();
    const current = this.currentIndex();
    if (total === 0) return 0;
    return current === total - 1 ? 0 : current + 1;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => {
      const movies = this.movies();
      if (movies.length > 0 && !this.autoPlayTimer) {
        untracked(() => {
          if (!this.isPaused()) this.startAutoPlay();
        });
      }
    });

    effect(() => {
      const moviesList = this.movies();
      const index = this.currentIndex();
      if (moviesList.length === 0) return;

      const currentMovie = moviesList[index];
      if (!currentMovie) return;

      const hasTrailerCached = this.trailerService.hasTrailer(currentMovie.id);
      if (hasTrailerCached !== undefined) return; // Already checked

      untracked(() => {
        this.movieService.getTrailerKeyForMovie(currentMovie.id).subscribe({
          next: (trailerKey) => {
            if (trailerKey) {
              this.moviesWithTrailer.update((set) => {
                const newSet = new Set(set);
                newSet.add(currentMovie.id);
                return newSet;
              });
            }
          },
          error: () => {},
        });
      });
    });

    destroyRef.onDestroy(() => {
      this.stopAutoPlay();
    });
  }

  goToPrev() {
    if (this.isTransitioning()) return;

    this.isTransitioning.set(true);
    this.previousIndex.set(this.currentIndex());
    this.slideDirection.set('prev');
    this.currentIndex.set(this.prevIndex());
    this.resetAutoPlay();

    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
    }

    this.transitionTimeoutId = setTimeout(() => {
      this.isTransitioning.set(false);
    }, 500);
  }

  goToNext() {
    if (this.isTransitioning()) return;

    this.isTransitioning.set(true);
    this.previousIndex.set(this.currentIndex());
    this.slideDirection.set('next');
    this.currentIndex.set(this.nextIndex());
    this.resetAutoPlay();

    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 500);
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
    }
  }

  private startAutoPlay() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused() && !this.trailerService.isOpenModal()) {
        this.goToNext();
      }
    }, this.AUTO_PLAY_INTERVAL);
  }

  private stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  pauseAutoPlay() {
    this.isPaused.set(true);
  }

  resumeAutoPlay() {
    this.isPaused.set(false);
  }

  openTrailer() {
    const moviesList = this.movies();
    const index = this.currentIndex();
    if (moviesList.length === 0) return;

    const currentMovie = moviesList[index];
    if (currentMovie) {
      this.trailerService.openTrailer(currentMovie.id);
      this.pauseAutoPlay();
    }
  }

  closeTrailer() {
    this.trailerService.closeTrailer();
    this.resumeAutoPlay();
  }
}
