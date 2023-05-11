import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'convl-italanta-apps-assessment-list-item',
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
