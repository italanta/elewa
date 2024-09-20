import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OnOffButtonComponent } from './components/on-off-button/on-off-button.component';
import { ScoreCardComponent } from './components/score-card/score-card.component';
import { CustomDropDownComponent } from './components/custom-dropdown/custom-drop-down.component';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    OnOffButtonComponent,
    ScoreCardComponent,
    CustomDropDownComponent,
    CustomSnackbarComponent
  ],
  exports: [OnOffButtonComponent, ScoreCardComponent, CustomDropDownComponent],
})

export class CustomComponentsModule {}
