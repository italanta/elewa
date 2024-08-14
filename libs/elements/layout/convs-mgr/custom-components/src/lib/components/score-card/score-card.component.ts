import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss',
})
export class ScoreCardComponent {
  @Input() text: string;
  @Input() score: string;
  @Input() backgroundColor: string;
  @Input() icon?: string;
  @Input() textColor: string;
}
