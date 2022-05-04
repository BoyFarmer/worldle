import { Component, OnInit } from '@angular/core';
import {GameService, Stats} from "../game/game.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  stats: Observable<[Stats[], [number, number, number]]>;
  constructor(private game: GameService) {
    this.stats = game.stats.pipe(
      map(stats => [stats, this.countOverallStats(stats)])
    )
  }

  ngOnInit(): void {
  }

  private countOverallStats(stats: Stats[]): [number, number, number] {
    const len = stats.length;
    if (len === 0) {
      return [0,0,0];
    }
    let guessed = 0;
    let skipped = 0;
    let tryScore = 0;
    stats.forEach(s => {
      tryScore += s.guesses.length;
      if (s.guesses.length === 0) {
        skipped +=1;
      } else if (s.guesses[s.guesses.length-1].country === s.country) {
        guessed +=1;
      } else if(s.guesses.length != 6) {
        skipped +=1;
      }
    });

    return [(guessed / len * 100), skipped, tryScore/ len];
  }
}
