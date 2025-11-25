import { Component, input, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.interface';

@Component({
  selector: 'app-movie-carousel',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './movie-carousel.html',
  styles: ``,
})
export class MovieCarousel {
  title = input.required<string>();
  movies = input.required<Movie[]>();

  readonly currentPage = signal<number>(0);
  readonly isHovering = signal<boolean>(false);

  readonly itemsPerPage = computed(() => {
    return 6;
  });

  readonly totalPages = computed(() => {
    const total = this.movies().length;
    const perPage = this.itemsPerPage();
    return Math.ceil(total / perPage);
  });

  readonly canGoPrev = computed(() => this.currentPage() > 0);
  readonly canGoNext = computed(() => this.currentPage() < this.totalPages() - 1);

  readonly translateX = computed(() => {
    return -(this.currentPage() * 100);
  });

  goToPrev() {
    if (this.canGoPrev()) {
      this.currentPage.update((page) => page - 1);
    }
  }

  goToNext() {
    if (this.canGoNext()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  onMouseEnter() {
    this.isHovering.set(true);
  }

  onMouseLeave() {
    this.isHovering.set(false);
  }
}
