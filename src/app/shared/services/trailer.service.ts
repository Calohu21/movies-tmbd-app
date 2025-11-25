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
  }

  setTrailerKey(key: string | null): void {
    this.currentTrailerKey.set(key);
    if (key) {
      this.isOpenModal.set(true);
    }
  }

  private loadTrailer(movieId: number): void {
    this.moviesService.getMovieVideos(movieId).subscribe({
      next: (videos) => {
        const trailerKey = this.moviesService.findOfficialTrailerKey(videos);
        if (trailerKey) {
          this.setTrailerKey(trailerKey);
        }
      },
      error: (err) => {
        console.error('Error loading trailer:', err);
        this.currentTrailerKey.set(null);
      },
    });
  }
}
