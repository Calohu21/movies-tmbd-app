import { Component, input, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.interface';
import { TmdbImagePipe } from '../../pipes/tmdb-image.pipe';

@Component({
  selector: 'app-movie-carousel',
  imports: [NgOptimizedImage, RouterLink, TmdbImagePipe],
  templateUrl: './movie-carousel.html',
  styles: ``,
})
export class MovieCarousel {
  title = input.required<string>();
  movies = input.required<Movie[]>();

  readonly startIndex = signal<number>(0);
  readonly isHovering = signal<boolean>(false);

  readonly itemsPerPage = computed(() => {
    return 6;
  });

  readonly totalMovies = computed(() => this.movies().length);

  readonly maxStartIndex = computed(() => {
    const total = this.totalMovies();
    const perPage = this.itemsPerPage();
    return Math.max(0, total - perPage);
  });

  readonly canGoPrev = computed(() => this.startIndex() > 0);
  readonly canGoNext = computed(() => this.startIndex() < this.maxStartIndex());

  readonly translateX = computed(() => {
    const start = this.startIndex();
    const perPage = this.itemsPerPage();
    if (perPage === 0) return 0;

    const percentPerMovie = 100 / perPage;
    return -(start * percentPerMovie);
  });

  goToPrev() {
    if (this.canGoPrev()) {
      const perPage = this.itemsPerPage();
      this.startIndex.update((index) => Math.max(0, index - perPage));
    }
  }

  goToNext() {
    if (this.canGoNext()) {
      const perPage = this.itemsPerPage();
      const maxIndex = this.maxStartIndex();
      this.startIndex.update((index) => Math.min(maxIndex, index + perPage));
    }
  }

  onMouseEnter() {
    this.isHovering.set(true);
  }

  onMouseLeave() {
    this.isHovering.set(false);
  }
}
