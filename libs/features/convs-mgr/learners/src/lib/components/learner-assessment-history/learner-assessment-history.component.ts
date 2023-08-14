import { Component } from '@angular/core';

@Component({
  selector: 'app-learner-assessment-history',
  templateUrl: './learner-assessment-history.component.html',
  styleUrls: ['./learner-assessment-history.component.scss'],
})
export class LearnerAssessmentHistoryComponent {
  displayedColumns: string[] = ['Assessment Name', 'Score', 'Duration Taken', 'Date Taken'];
  dataSource = [];
}
