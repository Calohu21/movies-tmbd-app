import { Component, input, output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-trailer',
  imports: [],
  templateUrl: './movie-trailer.html',
  styles: ``,
})
export class MovieTrailer {
  safeTrailerUrl = input.required<SafeResourceUrl | null>();
  isOpenModal = input.required<boolean>();
  closeModal = output<void>();

  close() {
    this.closeModal.emit();
  }
}
