import { Component, inject, signal } from '@angular/core';
import { MoviesService } from '../../../../movies.service';
import { Video } from '../../../../../core/models/video.interface';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly movieService = inject(MoviesService);
  readonly trendingMoviesResource = this.movieService.trendingMoviesResource;
  readonly trailerKey = signal<string | null>(null);

  getTrailer(movieId: number) {
    this.movieService.getMovieVideos(movieId).subscribe({
      next: (videos: Video[]) => {
        console.log({ videos });
        const oficialTrailer = this.findOfficialTrailer(videos);
        console.log('Oficial trailer', oficialTrailer);
        if (oficialTrailer) this.trailerKey.set(oficialTrailer.key);
        console.log('TrailerKey: ', this.trailerKey());
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
