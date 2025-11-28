import { Pipe, PipeTransform } from '@angular/core';
import { Genre } from '../../core/models/movie.detail.interface';

@Pipe({
  name: 'genres',
})
export class GenresPipe implements PipeTransform {
  transform(genres: Genre[] | undefined): Genre[] {
    if (!genres || genres.length === 0) {
      return [];
    }

    return genres;
  }
}
