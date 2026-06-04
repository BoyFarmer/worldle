import {bootstrapApplication} from '@angular/platform-browser';
import {provideZonelessChangeDetection} from '@angular/core';
import {AppComponent} from './app/app.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'end',
      }
    },
  ]
}).catch(err => console.error(err));
