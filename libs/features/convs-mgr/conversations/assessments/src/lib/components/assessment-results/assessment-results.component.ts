import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentResultsService } from '@app/state/convs-mgr/conversations/assessments';

import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';
import { AssessmentResult, AssessmentStatusTypes, AssessmentUserResults } from '@app/model/convs-mgr/micro-app/assessments';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss'],
})
export class AssessmentResultsComponent implements OnInit, OnDestroy {
  id: string;
  @Input() assessment: Assessment;

  assessmentResults: AssessmentResult;
  assessmentUserResults: AssessmentUserResults[];

  itemsLength: number;
  pageTitle: string;

  breadcrumbs$: Observable<iTalBreadcrumb[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _sBs = new SubSink();

  constructor(private _assessmentResultsSvc$: AssessmentResultsService
  ) {
  }

  ngOnInit() {
    this.getResults();
  }

  getResults() {
   this._sBs.sink = this._assessmentResultsSvc$.getResults(this.assessment.id as string)
                      .subscribe((resp)=> {
                        if(resp.success) {
                          this.assessmentResults = resp.results;
                          console.log(this.assessmentResults)
                        } else {
                          console.error(resp.error)
                        }
                      })

  this._sBs.sink = this._assessmentResultsSvc$.getUsers(this.assessment.id as string)
                    .subscribe((resp)=> {
                      if(resp.success) {
                        this.assessmentUserResults = resp.results;
                      } else {
                        console.error(resp.error)
                      }
                    })
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}