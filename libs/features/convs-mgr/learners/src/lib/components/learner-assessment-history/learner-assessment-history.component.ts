import { Component, Input, OnInit } from '@angular/core';

import { AssessmentCursor } from '@app/model/convs-mgr/conversations/admin/system';

@Component({
  selector: 'app-learner-assessment-history',
  templateUrl: './learner-assessment-history.component.html',
  styleUrls: ['./learner-assessment-history.component.scss'],
})
export class LearnerAssessmentHistoryComponent implements OnInit{
  @Input() assessments: AssessmentCursor[];

  displayedColumns: string[] = ['Assessment Name', 'Score', 'Duration Taken', 'Date Taken'];
  dataSource: AssessmentCursor[]= [];
  
  ngOnInit() {
    this.dataSource = this.assessments;
  }
}
