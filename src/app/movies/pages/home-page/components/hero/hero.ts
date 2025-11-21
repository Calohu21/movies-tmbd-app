import { Component, computed, inject, signal, OnDestroy, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoviesService } from '../../../../movies.service';
import { MovieWithTrailer } from '../../../../../core/models/video.interface';

@Component({
  selector: 'app-hero',
  imports: [NgClass],
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
  readonly currentIndex = signal<number>(0);
  readonly isOpenModal = signal<boolean>(false);
  readonly movies = computed<MovieWithTrailer[]>(() => this.heroDataResource.value() ?? []);

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
    effect(() => {
      const movies = this.movies();
      if (movies.length > 0 && !this.autoPlayTimer) {
        this.startAutoPlay();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  goToPrev(): void {
    this.currentIndex.set(this.prevIndex());
    this.resetAutoPlay();
  }

  goToNext(): void {
    this.currentIndex.set(this.nextIndex());
    this.resetAutoPlay();
  }

  private startAutoPlay(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused() && !this.isOpenModal()) {
        this.goToNext();
      }
    }, this.AUTO_PLAY_INTERVAL);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  pauseAutoPlay(): void {
    this.isPaused.set(true);
  }

  resumeAutoPlay(): void {
    this.isPaused.set(false);
  }

  openTrailer(): void {
    if (this.hasTrailer()) {
      this.isOpenModal.set(true);
      this.pauseAutoPlay();
    }
  }

  closeTrailer(): void {
    this.isOpenModal.set(false);
    this.resumeAutoPlay();
  }
}
