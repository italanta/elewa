import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { AssessmentCursor } from '@app/model/convs-mgr/conversations/admin/system';
import { SubSink } from 'subsink';

import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';


@Component({
  selector: 'app-learner-assessment-history',
  templateUrl: './learner-assessment-history.component.html',
  styleUrls: ['./learner-assessment-history.component.scss'],
})
export class LearnerAssessmentHistoryComponent implements OnInit, OnDestroy{
  @Input() assessments: AssessmentCursor[];
  private _sBs = new SubSink();

  allAssessments: Assessment[] = []

  dataSource = new MatTableDataSource<AssessmentCursor>();

  displayedColumns: string[] = ['Assessment Name', 'Score', 'Date done', 'Duration taken'];

  constructor(
    private _assessments: AssessmentService,
  ) {}
  
  ngOnInit() {
    this.getAllAssessments()
    this.dataSource.data = this.assessments;
  }

  getAllAssessments(){
    this._sBs.sink = this._assessments.getAssessments$().subscribe((assessment) => {
      this.allAssessments = assessment
    });
  }
  
  getAssessmentName(id: string) {
    return this.allAssessments.find((assessment => assessment.id === id))?.title
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }

}