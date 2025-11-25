import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DetailMovie } from '../../../../../core/models/movie.detail.interface';

@Component({
  selector: 'app-card-detail',
  imports: [NgOptimizedImage],
  templateUrl: './card-detail.html',
  styles: ``,
})
export class CardDetail {
  movie = input.required<DetailMovie | undefined>();
}
