import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { Video } from '../../../../../core/models/video.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly movieService = inject(MoviesService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly trendingMoviesResource = rxResource({
    stream: () => this.movieService.getTrendingMovies(),
  });

  readonly trailerKey = signal<string | null>(null);
  readonly loadingTrailer = signal<boolean>(false);
  readonly randomIndex = signal<number>(0);
  readonly isOpenModal = signal(false);

  readonly currentMovie = computed(() => {
    const movies = this.trendingMoviesResource.value();
    const index = this.randomIndex();
    if (!movies || movies.length === 0) return null;
    const safeIndex = index % movies.length;
    return movies[safeIndex];
  });

  readonly hasTrailerKey = computed(() => this.trailerKey() !== null);
  private initialized = false;

  constructor() {
    effect(() => {
      const movies = this.trendingMoviesResource.value();

      if (movies && movies.length > 0 && !this.initialized) {
        this.initialized = true;
        untracked(() => {
          this.randomIndex.set(Math.floor(Math.random() * movies.length));
        });
      }
    });

    effect(() => {
      const movie = this.currentMovie();

      if (movie) {
        untracked(() => {
          this.loadTrailerForMovie(movie.id);
        });
      }
    });
  }

  private loadTrailerForMovie(movieId: number) {
    this.trailerKey.set(null);
    this.loadingTrailer.set(true);

    this.movieService.getMovieVideos(movieId).subscribe({
      next: (videos: Video[]) => {
        const officialTrailer = this.findOfficialTrailer(videos);

        this.trailerKey.set(officialTrailer ? officialTrailer.key : null);
        this.loadingTrailer.set(false);
      },
      error: (err) => {
        console.error('ERROR al obtener videos:', err);
        this.trailerKey.set(null);
        this.loadingTrailer.set(false);
      },
    });
  }

  private findOfficialTrailer(videos: Video[]): Video | undefined {
    let trailer = videos.find(
      (v) => v.type === 'Trailer' && v.official && v.site === 'YouTube' && v.iso_639_1 === 'es',
    );

    if (!trailer) {
      trailer = videos.find((v) => v.type === 'Trailer' && v.official && v.site === 'YouTube');
    }
    if (!trailer) {
      trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    }

    if (!trailer) {
      trailer = videos.find((v) => v.type === 'Teaser' && v.official && v.site === 'YouTube');
    }

    return trailer;
  }

  readonly safeTrailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.trailerKey();
    if (!key) return null;
    const url = `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  openTrailer() {
    if (this.trailerKey()) {
      this.isOpenModal.set(true);
    }
  }

  closeTrailer() {
    this.isOpenModal.set(false);
  }

  onModalContentClick(event: Event) {
    event.stopPropagation();
  }
}
