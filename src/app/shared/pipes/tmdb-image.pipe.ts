import { Pipe, PipeTransform } from '@angular/core';

type ImageType = 'poster' | 'backdrop';

@Pipe({
  name: 'tmdbImage',
})
export class TmdbImagePipe implements PipeTransform {
  private readonly TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
  private readonly POSTER_SIZE = 'w500';
  private readonly BACKDROP_SIZE = 'original';

  transform(path: string | null | undefined, type: ImageType = 'poster'): string {
    if (!path) {
      return this.getPlaceholderImage(type);
    }

    const size = type === 'poster' ? this.POSTER_SIZE : this.BACKDROP_SIZE;
    return `${this.TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  private getPlaceholderImage(type: ImageType): string {
    const width = type === 'poster' ? 500 : 1280;
    const height = type === 'poster' ? 750 : 720;
    return `https://placehold.co/${width}x${height}/1a1a1a/666666?text=No+Image`;
  }
}
