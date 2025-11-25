import { Component, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { DetailMovie } from '../../../../../core/models/movie.detail.interface';
import { RuntimePipe } from '../../../../../shared/pipes/runtime.pipe';

@Component({
  selector: 'app-card-detail',
  imports: [NgOptimizedImage, DatePipe, RuntimePipe, RuntimePipe],
  templateUrl: './card-detail.html',
  styles: ``,
})
export class CardDetail {
  movie = input.required<DetailMovie | undefined>();
}
