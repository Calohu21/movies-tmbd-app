import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-movie-trailer',
  imports: [],
  templateUrl: './movie-trailer.html',
  styles: ``,
})
export class MovieTrailer {
  safeTrailerUrl = input.required();
  isOpenModal = input.required<boolean>();
  closeModal = output();

  close() {
    this.closeModal.emit();
  }
}
