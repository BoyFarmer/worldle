import {Component, DestroyRef, OnInit, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {GameService} from "./game/game.service";
import {countries, Country, sanitizeCountryName} from "./domain/countries";
import {generateCountrySequence, randomCountry} from "./domain/utils";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CountryCode} from "./domain/country";
import {MatDialog} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {CountryGuessComponent} from "./country-guess/country-guess.component";
import {StatsComponent} from "./stats/stats.component";
import {ChallengeDialogComponent, ChallengeSettings} from "./challenge/challenge-dialog.component";
import * as geolib from "geolib";
import {environment} from "../environments/environment";

export type Lang = 'pl' | 'en';

export interface Guess {
  countryName: string;
  polishName: string;
  country: CountryCode;
  direction: "S" | "W" | "NNE" | "NE" | "ENE" | "E" | "ESE" | "SE" | "SSE" | "SSW" | "SW" | "WSW" | "WNW" | "NW" | "NNW" | "N";
  distance: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    CountryGuessComponent,
    StatsComponent,
  ],
})
export class AppComponent implements OnInit {
  private game = inject(GameService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private timerId?: ReturnType<typeof setInterval>;

  readonly prefix = environment.production ? '/worldle' : '';
  readonly slots = [0, 1, 2, 3, 4, 5];

  // Game state
  language = signal<Lang>('pl');
  countryToGuess = signal<Country>(randomCountry());
  guesses = signal<Guess[]>([]);
  guessed = signal(false);
  gameOver = computed(() => this.guessed() || this.guesses().length === 6);
  errorMessage = signal('');
  countryToGuessName = computed(() =>
    this.language() === 'pl' ? this.countryToGuess().polishName : this.countryToGuess().name
  );

  // Challenge state
  challengeSettings = signal<ChallengeSettings | null>(null);
  challengeIndex = signal(0);
  challengeScore = signal(0);
  challengeFinished = signal(false);
  timeLeft = signal(0);
  isChallengeMode = computed(() => this.challengeSettings() !== null);
  timeLeftFormatted = computed(() => {
    const t = this.timeLeft();
    return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}`;
  });
  private challengeSequence: Country[] = [];

  // Autocomplete
  fc = new FormControl('');
  private inputValue = toSignal(this.fc.valueChanges, {initialValue: ''});
  countryNames = computed(() => {
    const lower = sanitizeCountryName(this.inputValue() ?? '');
    const lang = this.language();
    return countries
      .map(c => lang === 'pl' ? c.polishName : c.name)
      .filter(n => sanitizeCountryName(n).includes(lower))
      .sort((a, b) => a.localeCompare(b, lang));
  });

  ngOnInit() {
    this.destroyRef.onDestroy(() => clearInterval(this.timerId));
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('seed');
    const mode = params.get('mode');
    const value = params.get('value');
    if (seed && mode && value) {
      this.startChallenge({seed: Number(seed), mode: mode as 'countries' | 'time', value: Number(value)});
    }
  }

  setLanguage(lang: string) {
    if (lang === 'pl' || lang === 'en') this.language.set(lang);
  }

  openChallengeDialog() {
    this.dialog
      .open(ChallengeDialogComponent, {width: '420px', maxWidth: '95vw'})
      .afterClosed()
      .subscribe((result?: ChallengeSettings) => {
        if (result) this.startChallenge(result);
      });
  }

  startChallenge(settings: ChallengeSettings) {
    clearInterval(this.timerId);

    // Generate a deterministic country sequence from the seed
    const total = settings.mode === 'countries' ? settings.value : countryCodesWithImageLength();
    this.challengeSequence = generateCountrySequence(settings.seed, total);

    this.challengeSettings.set(settings);
    this.challengeIndex.set(0);
    this.challengeScore.set(0);
    this.challengeFinished.set(false);

    this.countryToGuess.set(this.challengeSequence[0]);
    this.guesses.set([]);
    this.guessed.set(false);
    this.fc.enable();
    this.fc.reset();
    this.errorMessage.set('');

    // Reflect settings in the URL so the link is shareable
    const url = new URL(window.location.href);
    url.searchParams.set('seed', String(settings.seed));
    url.searchParams.set('mode', settings.mode);
    url.searchParams.set('value', String(settings.value));
    window.history.pushState({}, '', url.toString());

    if (settings.mode === 'time') {
      this.startCountdown(settings.value * 60);
    }
  }

  private startCountdown(seconds: number) {
    clearInterval(this.timerId);
    this.timeLeft.set(seconds);
    this.timerId = setInterval(() => {
      this.timeLeft.update(t => {
        if (t <= 1) {
          clearInterval(this.timerId);
          this.challengeFinished.set(true);
          this.fc.disable();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  private nextChallengeCountry() {
    const settings = this.challengeSettings()!;
    const nextIdx = this.challengeIndex() + 1;

    const done = (settings.mode === 'countries' && nextIdx >= settings.value)
      || nextIdx >= this.challengeSequence.length;

    if (done) {
      clearInterval(this.timerId);
      this.challengeFinished.set(true);
      return;
    }

    this.challengeIndex.set(nextIdx);
    this.countryToGuess.set(this.challengeSequence[nextIdx]);
    this.guesses.set([]);
    this.guessed.set(false);
    this.fc.enable();
    this.fc.reset();
    this.errorMessage.set('');
  }

  replayChallenge() {
    this.startChallenge(this.challengeSettings()!);
  }

  exitChallenge() {
    clearInterval(this.timerId);
    this.challengeSettings.set(null);
    this.challengeFinished.set(false);
    window.history.pushState({}, '', window.location.pathname);
    this.countryToGuess.set(randomCountry());
    this.guesses.set([]);
    this.guessed.set(false);
    this.fc.enable();
    this.fc.reset();
    this.errorMessage.set('');
  }

  submit() {
    const v = this.fc.value?.trim() ?? '';
    if (!v) return;

    const lang = this.language();
    const ctr = lang === 'pl'
      ? countries.find(c => c.polishName === v)
      : countries.find(c => c.name === v);

    if (!ctr) {
      this.errorMessage.set('Unknown country — check the spelling');
      return;
    }
    this.errorMessage.set('');

    const distance = geolib.getDistance(ctr, this.countryToGuess());
    const direction = geolib.getCompassDirection(ctr, this.countryToGuess());
    this.guesses.update(prev => [...prev, {
      countryName: ctr.name,
      polishName: ctr.polishName,
      country: ctr.code as unknown as CountryCode,
      distance,
      direction,
    }]);
    this.fc.reset();

    const targetName = lang === 'pl' ? this.countryToGuess().polishName : this.countryToGuess().name;
    const correct = sanitizeCountryName(targetName) === sanitizeCountryName(v);

    if (correct) {
      this.guessed.set(true);
      this.fc.disable();
      this.saveStats();
      if (this.isChallengeMode()) {
        this.challengeScore.update(s => s + 1);
        setTimeout(() => this.nextChallengeCountry(), 2000);
      }
    } else if (this.guesses().length === 6) {
      this.fc.disable();
      this.saveStats();
      if (this.isChallengeMode()) {
        setTimeout(() => this.nextChallengeCountry(), 2000);
      }
    }
  }

  reset() {
    this.countryToGuess.set(randomCountry());
    this.guesses.set([]);
    this.guessed.set(false);
    this.errorMessage.set('');
    this.fc.enable();
    this.fc.reset();
  }

  private saveStats() {
    this.game.addStat({
      country: this.countryToGuess().code as unknown as CountryCode,
      guesses: this.guesses(),
      date: new Date(),
    });
  }
}

// Avoids importing the full const array just for its length
function countryCodesWithImageLength(): number {
  return 244; // length of countryCodesWithImage — enough for a long timed run
}
