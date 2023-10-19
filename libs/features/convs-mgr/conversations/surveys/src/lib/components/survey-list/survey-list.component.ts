import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { BehaviorSubject, Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Survey } from '@app/model/convs-mgr/conversations/surveys';
import { SurveyService } from '@app/state/convs-mgr/conversations/surveys';
import { EndUserService } from '@app/state/convs-mgr/end-users';

import { ActionSortingOptions } from '../../utils/sorting-options.enum';
import { SurveyMetricsService } from '../../services/survey-metrics.service';


@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent implements OnInit, OnDestroy{
  private _sBs = new SubSink();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  sortSurveysBy = 'newest';

  surveys$: Observable<Survey[]>;

  dataSource = new MatTableDataSource<Survey>();

  dataFound = true;
  viewInListView = true;

  constructor(private _aMetrics: SurveyMetricsService,
              private _surveys: SurveyService,
              private _endUserService: EndUserService,
              private _dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.surveys$ = this._surveys.getSurveys$();
    this._sBs.sink = combineLatest(([this.surveys$, this.sorting$$.asObservable()]))
          .pipe(map(([surveys, sort]) => 
            __orderBy(surveys,(a) => __DateFromStorage(a.createdOn!).unix(),
            sort === ActionSortingOptions.Newest ? 'desc' : 'asc'
          )),
          tap((surveys) => { this.dataSource.data = surveys})).subscribe()
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
    this.dataFound = (this.dataSource.filteredData.length > 0);
  }

  sortBy(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value as ActionSortingOptions;
    this.sortSurveysBy = searchValue;
    this.sorting$$.next(searchValue);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
