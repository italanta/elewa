import { Component, Input } from '@angular/core';

import { formatDuration } from '../../../utils/format-duration.util';

@Component({
  selector: 'app-completion-time',
  templateUrl: './completion-time.component.html',
  styleUrl: './completion-time.component.scss'
})
export class CompletionTimeComponent {
  /** The average completion time in milliseconds */
  @Input() completionTime: number;

  formatTime() {
    return formatDuration((this.completionTime/1000));
  }
}
