import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { EndUserService } from '@app/state/convs-mgr/end-users';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentMetricsService } from '../../services/assessment-metrics.service';
import { ActionSortingOptions } from '../../utils/sorting-options.enum';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  sortAssessmentsBy = 'newest';

  assessments$: Observable<Assessment[]>;

  dataSource = new MatTableDataSource<Assessment>();

  dataFound = true;
  viewInListView = true;

  constructor(private _aMetrics: AssessmentMetricsService,
              private _assessments: AssessmentService,
              private _endUserService: EndUserService,
              private _dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.assessments$ = this._assessments.getAssessments$();
    this._sBs.sink = combineLatest(([this.assessments$, this.sorting$$.asObservable()]))
          .pipe(map(([assessments, sort]) => 
            __orderBy(assessments,(a) => __DateFromStorage(a.createdOn!).unix(),
            sort === ActionSortingOptions.Newest ? 'desc' : 'asc'
          )),
          tap((assessments) => { this.dataSource.data = assessments})).subscribe()
    this.getMetrics();
  }

  getMetrics() {
    this._sBs.sink = this._endUserService
      .getUserDetailsAndTheirCursor()
      .pipe(
        switchMap((endUsers) => {
          return this._assessments.getAssessments$().pipe(
            map((assessments) => {
              return assessments.map((assessment) => {
                return (assessment.metrics = this._aMetrics.computeMetrics(endUsers,assessment).assessmentMetrics);
              });
            })
          );
        })
      )
      .subscribe();
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
    this.dataFound = (this.dataSource.filteredData.length > 0);
  }

  sortBy(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value as ActionSortingOptions;
    this.sortAssessmentsBy = searchValue;
    this.sorting$$.next(searchValue);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
