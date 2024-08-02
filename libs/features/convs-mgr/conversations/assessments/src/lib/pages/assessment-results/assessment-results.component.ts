import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Chart } from 'chart.js';
import { SubSink } from 'subsink';
import { map, switchMap, Observable } from 'rxjs';
import { Timestamp } from 'firebase-admin/firestore';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveAssessmentStore } from '@app/state/convs-mgr/conversations/assessments';

import { BreadcrumbService } from '@app/elements/layout/ital-bread-crumb'; 
import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss'],
})
export class AssessmentResultsComponent implements OnInit, OnDestroy {
  id: string;
  assessment: Assessment;

  itemsLength: number;
  pageTitle: string;

  breadcrumbs$: Observable<iTalBreadcrumb[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _sBs = new SubSink();

  constructor(
    private _activeAssessment$$: ActiveAssessmentStore,
    private _breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbs$ = this._breadcrumbService.breadcrumbs$;
  }

  ngOnInit() {
    this.getAssessment();
  }

  getAssessment() {
    this._sBs.sink = this._activeAssessment$$.get()
        .subscribe((assessment)=> {
            this.assessment = assessment
            this.pageTitle = `Assessments / ${assessment.title} / results`;
          });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
