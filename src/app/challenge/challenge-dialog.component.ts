import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";

export type ChallengeMode = 'countries' | 'time';

export interface ChallengeSettings {
  seed: number;
  mode: ChallengeMode;
  value: number;
}

@Component({
  selector: 'app-challenge-dialog',
  templateUrl: './challenge-dialog.component.html',
  styleUrls: ['./challenge-dialog.component.scss'],
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
  ],
})
export class ChallengeDialogComponent {
  private dialogRef = inject(MatDialogRef<ChallengeDialogComponent>);

  mode: ChallengeMode = 'countries';
  value = 10;

  get maxValue() { return this.mode === 'time' ? 60 : 50; }
  get label()    { return this.mode === 'time' ? 'Minutes' : 'Countries'; }
  get hint()     { return this.mode === 'time' ? '1 – 60 minutes' : '1 – 50 countries'; }

  start() {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    this.dialogRef.close({seed, mode: this.mode, value: Math.max(1, this.value)} as ChallengeSettings);
  }
}
