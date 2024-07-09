import { Component } from '@angular/core';

@Component({
  selector: 'app-assessment-failed-section',
  templateUrl: './assessment-failed-section.component.html',
  styleUrls: ['./assessment-failed-section.component.scss'],
})
export class AssessmentFailedSectionComponent {
  /** Placeholder for trials
   *  TODO: Fetch actual trials from published assessment
   */
  trials = 2
}
