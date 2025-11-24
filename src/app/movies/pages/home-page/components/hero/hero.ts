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
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoviesService } from '../../../../movies.service';
import { MovieWithTrailer } from '../../../../../core/models/video.interface';
import { MovieTrailer } from '../movie-trailer/movie-trailer';

@Component({
  selector: 'app-hero',
  imports: [MovieTrailer, NgOptimizedImage],
  templateUrl: './hero.html',
})
export class Hero implements OnDestroy {
  private readonly movieService = inject(MoviesService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_PLAY_INTERVAL = 8000; // 8 segundos
  private readonly isPaused = signal<boolean>(false);
  private readonly hasTrailer = computed<boolean>(() => this.currentTrailerKey() !== null);
  private readonly totalMovies = computed<number>(() => this.movies().length);
  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly currentIndex = signal<number>(0);
  readonly previousIndex = signal<number>(-1);
  readonly slideDirection = signal<'next' | 'prev'>('next');
  readonly isTransitioning = signal<boolean>(false);
  readonly isOpenModal = signal<boolean>(false);
  readonly movies = computed<MovieWithTrailer[]>(() => {
    if (this.heroDataResource.error()) {
      return [];
    }
    return this.heroDataResource.value() ?? [];
  });

  readonly heroDataResource = rxResource({
    stream: () => this.movieService.getTrendingMovieWithTrailer(),
  });

  readonly currentTrailerKey = computed<string | null>(() => {
    const moviesList = this.movies();
    const index = this.currentIndex();
    if (moviesList.length === 0) return null;
    return moviesList[index]?.trailerKey ?? null;
  });

  readonly safeTrailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.currentTrailerKey();
    if (!key) return null;
    const url = `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
      if (!this.isPaused() && !this.isOpenModal()) {
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
    if (this.hasTrailer()) {
      this.isOpenModal.set(true);
      this.pauseAutoPlay();
    }
  }

  closeTrailer() {
    this.isOpenModal.set(false);
    this.resumeAutoPlay();
  }
}
