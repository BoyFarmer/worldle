import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Guess} from "../app.component";

@Component({
  selector: 'app-country-guess',
  templateUrl: './country-guess.component.html',
  styleUrls: ['./country-guess.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryGuessComponent {
  @Input() guess?: Guess;
  @Input() index: string = '';

}
