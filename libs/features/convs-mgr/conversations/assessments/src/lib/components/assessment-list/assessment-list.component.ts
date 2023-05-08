import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'convl-italanta-apps-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent implements OnInit{
  assessments$: Observable<AssessmentQuestion[]>;
  assessmentsColumns = ['name', 'inProgress', 'responses', 'actions'];

  constructor(private _assessments: AssessmentService){}

  ngOnInit(): void {
    this.assessments$ = this._assessments.getAssessments$();
  }
}
