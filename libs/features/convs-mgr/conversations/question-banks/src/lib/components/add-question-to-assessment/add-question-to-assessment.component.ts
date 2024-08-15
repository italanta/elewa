import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { __DateFromStorage } from '@iote/time';
import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-add-question-to-assessment',
  templateUrl: './add-question-to-assessment.component.html',
  styleUrl: './add-question-to-assessment.component.scss',
})
export class AddQuestionToAssessmentComponent implements OnInit, OnDestroy
{
  assessmentsColumns = [ 'actions', 'title', 'status', 'updatedOn'];

  dataSource = new MatTableDataSource<Assessment>();
  assessments: Assessment[];
  assessments$: Observable<Assessment[]>;
  hasData: boolean;
  noneSelected: boolean;
  question: AssessmentQuestion;

  private _sBS = new SubSink();

  constructor(private _router: Router,
              private _assessmentService: AssessmentService,
              private _dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: { question: AssessmentQuestion }
  ) {
    this.question = this.data.question
  }

  ngOnInit(): void 
  {
    this.assessments$ = this._assessmentService.getAssessments$();
    this._sBS.sink = this.assessments$.subscribe((assessments) => { 
      console.log(assessments)
      this.dataSource.data = assessments;
      this.hasData = true
    })  
  }

  openAssessment(assessmentId: string) 
  {
    this._router.navigate(['/assessments', assessmentId]);
  }

  getFormattedDate(date: Date)
  {
    const newDate = __DateFromStorage(date as Date);
    return newDate.format('DD/MM/YYYY HH:mm');
  }

  addToAssessment()
  {
    console.log(this.question)
  }

  closeDialog(){
    this._dialog.closeAll()
  }


  ngOnDestroy(): void 
  {
      this._sBS.unsubscribe()
  }
}
