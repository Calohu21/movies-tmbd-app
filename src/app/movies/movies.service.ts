import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { Movie, MovieResponse } from '../core/models/movie.interface';
import { Video, VideoResponse } from '../core/models/video.interface';

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
}
