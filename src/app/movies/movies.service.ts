import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { Movie, MovieResponse } from '../core/models/movie.interface';
import { MovieWithTrailer, Video, VideoResponse } from '../core/models/video.interface';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getTrendingMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/trending/movie/day`)
      .pipe(map((response) => response.results));
  }

  private getMovieVideos(movieId: number): Observable<Video[]> {
    return this.http
      .get<VideoResponse>(`${this.apiUrl}/movie/${movieId}/videos`)
      .pipe(map((response) => response.results));
  }

  getRandomTrendingMovieWithTrailer(): Observable<MovieWithTrailer> {
    return this.getTrendingMovies().pipe(
      switchMap((movies) => {
        if (!movies || movies.length === 0) {
          throw new Error('No trending movies found');
        }

        const randomIndex = Math.floor(Math.random() * movies.length);
        const movie = movies[randomIndex];

        return this.getMovieVideos(movie.id).pipe(
          map((videos) => ({
            movie,
            trailerKey: this.findOfficialTrailerKey(videos),
          })),
          catchError(() => of({ movie, trailerKey: null })),
        );
      }),
    );
  }

  findOfficialTrailerKey(videos: Video[]): string | null {
    const trailer =
      videos.find(
        (v) => v.type === 'Trailer' && v.official && v.site === 'YouTube' && v.iso_639_1 === 'es',
      ) ||
      videos.find((v) => v.type === 'Trailer' && v.official && v.site === 'YouTube') ||
      videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
      videos.find((v) => v.type === 'Teaser' && v.official && v.site === 'YouTube');

    return trailer?.key ?? null;
  }
}
