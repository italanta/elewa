import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss',
})
export class ScoreCardComponent {
  @Input() text: string;
  @Input() score: string;
  @Input() color: string;
  @Input() icon?: string;
}
