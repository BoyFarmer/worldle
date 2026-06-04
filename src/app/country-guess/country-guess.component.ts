import {Component, computed, input} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Guess, Lang} from "../app.component";
import {DistancePipe} from "../distance.pipe";
import {DirectionPipe} from "../direction.pipe";

@Component({
  selector: 'app-country-guess',
  templateUrl: './country-guess.component.html',
  styleUrls: ['./country-guess.component.scss'],
  imports: [MatIconModule, DistancePipe, DirectionPipe, DecimalPipe],
})
export class CountryGuessComponent {
  guess = input<Guess>();
  number = input.required<number>();
  language = input<Lang>('pl');

  displayName = computed(() => {
    const g = this.guess();
    if (!g) return '';
    return this.language() === 'pl' ? g.polishName : g.countryName;
  });

  distanceLevel = computed(() => {
    const d = this.guess()?.distance;
    if (d === undefined) return '';
    if (d < 500_000)    return 'very-close';
    if (d < 2_000_000)  return 'close';
    if (d < 5_000_000)  return 'medium';
    if (d < 10_000_000) return 'far';
    return 'very-far';
  });
}
