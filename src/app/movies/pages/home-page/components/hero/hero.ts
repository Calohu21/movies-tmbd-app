import { Component, computed, effect, inject, signal } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { Video } from '../../../../../core/models/video.interface';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly movieService = inject(MoviesService);
  private readonly trailerKey = signal<string | null>(null);
  readonly hasTrailerKey = computed(() => this.trailerKey() !== null);
  readonly trendingMoviesResource = this.movieService.trendingMoviesResource;
  readonly random = signal(0);
  constructor() {
    effect(() => {
      this.random.set(Math.floor(Math.random() * 20));
    });
  }

  getTrailer(movieId: number) {
    this.movieService.getMovieVideos(movieId).subscribe({
      next: (videos: Video[]) => {
        const oficialTrailer = this.findOfficialTrailer(videos);
        if (oficialTrailer) {
          this.trailerKey.set(oficialTrailer.key);
        } else {
          this.trailerKey.set(null);
        }
      },
      error: (err) => console.error('ERROR al obtener videos:', err),
    });
  }

  findOfficialTrailer(videos: Video[]): Video | undefined {
    let trailer = videos.find((v) => v.type === 'Trailer' && v.official && v.site === 'YouTube');
    if (!trailer) {
      trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    }
    if (!trailer) {
      trailer = videos.find((v) => v.type === 'Teaser' && v.official && v.site === 'YouTube');
    }
    return trailer;
  }
}
