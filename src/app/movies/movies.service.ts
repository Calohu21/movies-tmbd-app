import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Movie, MovieResponse } from '../core/models/movie.interface';
import { MovieWithTrailer, Video, VideoResponse } from '../core/models/video.interface';
import { DetailMovie } from '../core/models/movie.detail.interface';

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

  getMovieVideos(movieId: number): Observable<Video[]> {
    return this.http
      .get<VideoResponse>(`${this.apiUrl}/movie/${movieId}/videos`)
      .pipe(map((response) => response.results));
  }

  getTrendingMovieWithTrailer(): Observable<MovieWithTrailer[]> {
    return this.getTrendingMovies().pipe(
      switchMap((movies) => {
        if (!movies || movies.length === 0) {
          throw new Error('No trending movies found');
        }

        const movieWithTrailerRequests: Observable<MovieWithTrailer>[] = movies.map((movie) =>
          this.getMovieVideos(movie.id).pipe(
            map((videos) => ({
              movie,
              trailerKey: this.findOfficialTrailerKey(videos),
            })),
            catchError(() => of({ movie, trailerKey: null })),
          ),
        );

        return forkJoin(movieWithTrailerRequests);
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

  /**
   * Fetches trailer key on-demand for a specific movie
   * @param movieId - The ID of the movie
   * @returns Observable<string | null> - The trailer key or null if not found
   */
  getTrailerKeyForMovie(movieId: number): Observable<string | null> {
    return this.getMovieVideos(movieId).pipe(
      map((videos) => this.findOfficialTrailerKey(videos)),
      catchError((error) => {
        console.error(`Error loading trailer for movie ${movieId}:`, error);
        return of(null);
      }),
    );
  }

  getUpcomingMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/movie/upcoming`)
      .pipe(map((response) => response.results));
  }

  getNowPlayingMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/movie/now_playing`)
      .pipe(map((response) => response.results));
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/movie/popular`)
      .pipe(map((response) => response.results));
  }

  getTopRatedMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/movie/top_rated`)
      .pipe(map((response) => response.results));
  }

  getMovieById(movieId: string): Observable<DetailMovie> {
    return this.http
      .get<DetailMovie>(`${this.apiUrl}/movie/${movieId}`)
      .pipe(tap((movie) => console.log(movie)));
  }
}
