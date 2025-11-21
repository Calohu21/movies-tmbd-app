import { Movie } from './movie.interface';

export interface VideoResponse {
  id: number;
  results: Video[];
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieWithTrailer {
  movie: Movie;
  trailerKey: string | null;
}
