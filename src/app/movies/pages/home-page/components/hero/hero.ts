import { Component, computed, effect, inject, signal } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { Video } from '../../../../../core/models/video.interface';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly movieService = inject(MoviesService);

  readonly trailerKey = signal<string | null>(null);
  readonly loadingTrailer = signal<boolean>(false);
  readonly hasTrailerKey = computed(() => this.trailerKey() !== null);

  readonly trendingMoviesResource = rxResource({
    stream: () => this.movieService.getTrendingMovies(),
  });

  readonly randomIndex = signal<number>(0);

  readonly currentMovie = computed(() => {
    const movies = this.trendingMoviesResource.value();
    if (!movies || movies.length === 0) return null;
    return movies[this.randomIndex()];
  });

  constructor() {
    effect(() => {
      const movie = this.currentMovie();
      this.selectRandomMovie();
      if (movie) {
        this.loadTrailerForMovie(movie.id);
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

  selectRandomMovie(): void {
    const movies = this.trendingMoviesResource.value();
    if (movies && movies.length > 0) {
      this.randomIndex.set(Math.floor(Math.random() * movies.length));
    }
  }

  openTrailer(): void {
    const key = this.trailerKey();
    if (key) {
      window.open(`https://www.youtube.com/watch?v=${key}`, '_blank');
    }
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
}
