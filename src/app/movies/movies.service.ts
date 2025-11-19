import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, MovieResponse } from '../core/models/movie.interface.ts';
import { environment } from '../environments/environment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  trendingMovies = signal<Movie[]>([]);

  getTrendingMovies(): void {
    this.http
      .get<MovieResponse>(
        `${this.apiUrl}/trending/movie/day?api_key=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTRhMmFmODJkMjdjOTcyMzJjNzVhZmJkMGY3YzQ3NCIsIm5iZiI6MTc2MjM0MjUwNy43MTQsInN1YiI6IjY5MGIzNjZiY2E4NTFjMTMyZWUxODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oPHfofBAsDXI7ZRnwCwYAimJpm79UzQMfx2I1vcw27A`,
      )
      .pipe(
        tap((response: MovieResponse) => this.trendingMovies.set(response.results)),
        map((response) => response.results),
        tap((movies) => console.log(movies)),
      );
  }
}
