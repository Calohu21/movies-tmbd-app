import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, MovieResponse } from '../core/models/movie.interface.ts';
import { environment } from '../environments/environment';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  apikey = environment.apiKey;
  trendingMovies = signal<Movie[]>([]);

  getTrendingMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieResponse>(`${this.apiUrl}/trending/movie/day?api_key=${this.apikey}`)
      .pipe(
        tap((response: MovieResponse) => this.trendingMovies.set(response.results)),
        map((response) => response.results),
        tap((movies) => console.log('Service: ', movies)),
      );
  }
}
