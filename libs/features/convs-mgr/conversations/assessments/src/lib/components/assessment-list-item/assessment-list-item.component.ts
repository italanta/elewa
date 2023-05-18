import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';


@Component({
  selector: 'app-assessment-list-item',
  templateUrl: './assessment-list-item.component.html',
  styleUrls: ['./assessment-list-item.component.scss'],
})
export class AssessmentListItemComponent implements OnInit {
  @Input() assessment: Assessment;
  questions$: Observable<AssessmentQuestion[]>;

  constructor(private _route: Router){}

  ngOnInit(): void {
    this.questions$ = of([]);
  }

  goToAssessmentEdit(assessmentId: string){
    this._route.navigate(['/assessments', assessmentId, 'edit']);
  }
}
