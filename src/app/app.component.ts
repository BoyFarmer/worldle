import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GameService} from "./game/game.service";
import {countries, Country, sanitizeCountryName} from "./domain/countries";
import {country, randomCountry} from "./domain/utils";
import {FormControl, FormGroup} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {CountryCode} from "./domain/country";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as geolib from "geolib";
import {environment} from "../environments/environment";

export interface Guess {
  countryName: string,
  country: CountryCode;
  direction: "S" | "W" | "NNE" | "NE" | "ENE" | "E" | "ESE" | "SE" | "SSE" | "SSW" | "SW" | "WSW" | "WNW" | "NW" | "NNW" | "N",
  distance: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  prefix = environment.production ? '/worldle' : '';
  fg = new FormGroup({value: new FormControl('')});
  private allCountries = countries.map(c => c.name);
  countryNames: Observable<string[]>;
  countryToGuess!: Country;
  guesses: Guess[] = [];
  guessed = false;

  constructor(private game: GameService, private snackbar: MatSnackBar) {
    this.newGame();
    this.countryNames = this.fg.valueChanges.pipe(
      map(v => v.value),
      startWith(''),
      map(value => this.filter(value))
    )
  }

  private newGame() {
    this.countryToGuess = randomCountry();
    this.guesses = [];
    this.guessed = false;
    this.fg.enable();
  }
  private filter(value: string) {
    const lowercase = (value ?? '').toLowerCase();
    return this.allCountries.filter(v => sanitizeCountryName(v).includes(lowercase));
  }

  reset() {
    if (!this.guessed) {
      this.game.addStat({
        country: this.countryToGuess.code as unknown as CountryCode,
        guesses: this.guesses,
        date: new Date(),
      });
    }
    this.newGame();
  }


  addStatForCountry(ctr: Country): void  {
    const distance = geolib.getDistance(ctr, this.countryToGuess);
    const direction = geolib.getCompassDirection(ctr,this.countryToGuess)
    this.guesses.push({
      countryName: ctr.name,
      country: ctr.code as unknown as CountryCode,
      distance,
      direction
    })
  }

  submit() {
    const v = this.fg.value.value ?? '';
    const ctr = country(v);


    if(ctr) {
      this.addStatForCountry(ctr);
      this.fg.reset();
      if (sanitizeCountryName(this.countryToGuess.name) === sanitizeCountryName(v)) {
        this.game.addStat({
          country: this.countryToGuess.code as unknown as CountryCode,
          guesses: this.guesses,
          date: new Date(),
        });
        this.snackbar.open("You dit it,  " +this.countryToGuess.name);
        this.guessed = true;
        this.fg.disable();
      } else if (this.guesses.length === 6){
        this.fg.disable();
        this.snackbar.open("Game over, this is " +this.countryToGuess.name);
      }
    } else {
      this.snackbar.open('Unknown country');
    }
  }
}
