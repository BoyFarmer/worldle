import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {

  transform(value: number): number {
    return Math.floor(value / 1000);
  }

}
