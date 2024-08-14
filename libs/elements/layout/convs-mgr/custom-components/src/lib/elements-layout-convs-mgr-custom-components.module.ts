import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnOffButtonComponent } from './components/on-off-button/on-off-button.component';
import { ScoreCardComponent } from './components/score-card/score-card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [OnOffButtonComponent, ScoreCardComponent],
  exports: [OnOffButtonComponent, ScoreCardComponent],
})
export class CustomComponentsModule {}
