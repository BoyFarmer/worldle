import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import { CountryGuessComponent } from './country-guess/country-guess.component';
import { DistancePipe } from './distance.pipe';
import {MatIconModule} from "@angular/material/icon";
import { DirectionPipe } from './direction.pipe';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryGuessComponent,
    DistancePipe,
    DirectionPipe,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  providers: [{
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      duration: 2500,
      horizontalPosition: 'end',
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
