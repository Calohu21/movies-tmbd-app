import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoviesService } from '../../../../movies.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly movieService = inject(MoviesService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly heroDataResource = rxResource({
    stream: () => this.movieService.getRandomTrendingMovieWithTrailer(),
  });

  readonly isOpenModal = signal(false);
  readonly currentMovie = computed(() => this.heroDataResource.value()?.movie ?? null);
  readonly trailerKey = computed(() => this.heroDataResource.value()?.trailerKey ?? null);
  readonly hasTrailer = computed(() => this.trailerKey() !== null);

  readonly safeTrailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.trailerKey();
    if (!key) return null;
    const url = `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  openTrailer(): void {
    if (this.hasTrailer()) {
      this.isOpenModal.set(true);
    }
  }

  closeTrailer(): void {
    this.isOpenModal.set(false);
  }

  loadAnotherMovie(): void {
    this.heroDataResource.reload();
  }
}
