import {Injectable} from '@angular/core';
import {ReplaySubject} from "rxjs";
import {CountryCode} from "../domain/country";
import {Guess} from "../app.component";

export interface Stats {
  date: Date;
  country: CountryCode;
  guesses: Guess[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private lastStats: Stats[] = [];
  private statistics = new ReplaySubject<Stats[]>(1);

  constructor() {
    this.loadStats();
  }

  get stats() {
    return this.statistics.asObservable();
  }

  addStat(stat: Stats) {
    this.lastStats = [... this.lastStats, stat];
    this.statistics.next(this.lastStats);
    this.saveStats();
  }

  private loadStats() {
    const stats = localStorage.getItem("stats");
    if (stats) {
      this.lastStats = JSON.parse(stats);
      this.statistics.next(this.lastStats);
    }
  }

  private saveStats() {
    localStorage.setItem('stats', JSON.stringify(this.lastStats));
  }
}
