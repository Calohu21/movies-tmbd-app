import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runtime',
})
export class RuntimePipe implements PipeTransform {
  transform(minutes: number | undefined): string {
    if (!minutes || minutes <= 0) {
      return '';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    }

    return `${hours}h ${mins}m`;
  }
}
