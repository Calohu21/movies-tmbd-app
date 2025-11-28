import { Injectable, inject, signal, computed } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoviesService } from '../../movies/movies.service';

@Injectable({
  providedIn: 'root',
})
export class TrailerService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly moviesService = inject(MoviesService);

  readonly isOpenModal = signal<boolean>(false);
  readonly currentMovieId = signal<number | null>(null);
  readonly currentTrailerKey = signal<string | null>(null);
  readonly isLoadingTrailer = signal<boolean>(false);

  private readonly trailerCache = new Map<number, string | null>();

  readonly safeTrailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.currentTrailerKey();
    if (!key) return null;
    const url = `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  openTrailer(movieId: number): void {
    this.currentMovieId.set(movieId);
    this.loadTrailer(movieId);
  }

  closeTrailer(): void {
    this.isOpenModal.set(false);
    this.currentTrailerKey.set(null);
    this.currentMovieId.set(null);
    this.isLoadingTrailer.set(false);
  }

  setTrailerKey(key: string | null): void {
    this.currentTrailerKey.set(key);
    if (key) {
      this.isOpenModal.set(true);
    }
  }

  private loadTrailer(movieId: number): void {
    const cached = this.trailerCache.get(movieId);
    if (cached !== undefined) {
      this.setTrailerKey(cached);
      return;
    }

    this.isLoadingTrailer.set(true);

    this.moviesService.getTrailerKeyForMovie(movieId).subscribe({
      next: (trailerKey) => {
        this.trailerCache.set(movieId, trailerKey);
        this.isLoadingTrailer.set(false);
        if (trailerKey) {
          this.setTrailerKey(trailerKey);
        } else {
          console.warn(`No trailer found for movie ${movieId}`);
        }
      },
      error: (err) => {
        console.error('Error loading trailer:', err);
        this.trailerCache.set(movieId, null);
        this.isLoadingTrailer.set(false);
        this.currentTrailerKey.set(null);
      },
    });
  }

  hasTrailer(movieId: number): boolean | undefined {
    const cached = this.trailerCache.get(movieId);
    if (cached === undefined) return undefined; // Not checked yet
    return cached !== null; // true if has trailer, false if null
  }

  clearCache(): void {
    this.trailerCache.clear();
  }
}
