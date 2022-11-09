import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMinToHour',
})
export class ConvertMinToHourPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    return `${hours}h ${minutes}mins`;
  }
}
