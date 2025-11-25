import { Component, inject, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { DetailMovie } from '../../../../../core/models/movie.detail.interface';
import { RuntimePipe } from '../../../../../shared/pipes/runtime.pipe';
import { GenresPipe } from '../../../../../shared/pipes/genres.pipe';
import { TrailerService } from '../../../../../shared/services/trailer.service';
import { MovieTrailer } from '../../../../../shared/components/movie-trailer/movie-trailer';

@Component({
  selector: 'app-card-detail',
  imports: [NgOptimizedImage, DatePipe, RuntimePipe, GenresPipe, MovieTrailer],
  templateUrl: './card-detail.html',
  styles: ``,
})
export class CardDetail {
  movie = input.required<DetailMovie | undefined>();
  readonly trailerService = inject(TrailerService);

  openTrailer() {
    const movieId = this.movie()?.id;
    if (movieId) {
      this.trailerService.openTrailer(movieId);
    }
  }

  closeTrailer() {
    this.trailerService.closeTrailer();
  }
}
