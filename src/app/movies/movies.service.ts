import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, MovieResponse } from '../core/models/movie.interface.ts';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly apikey = environment.apiKey;

  readonly trendingMoviesResource = rxResource({
    stream: () => this.getTrendingMovies(),
  });

  getTrendingMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/trending/movie/day?api_key=${this.apikey}`)
      .pipe(map((response) => response.results));
  }
}
