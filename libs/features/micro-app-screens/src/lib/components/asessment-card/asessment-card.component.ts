import { Component, Input } from '@angular/core';
import { AssessmentQuestion } from '../../models/assessment-question.interface';

@Component({
  selector: 'app-asessment-card',
  templateUrl: './asessment-card.component.html',
  styleUrls: ['./asessment-card.component.scss']
})
export class AsessmentCardComponent {
  @Input() assessmentQuestions: AssessmentQuestion[];
}
