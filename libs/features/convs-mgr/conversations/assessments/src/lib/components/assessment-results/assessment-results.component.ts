import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Chart } from 'chart.js';
import { SubSink } from 'subsink';
import { map, switchMap, Observable } from 'rxjs';

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
  @Input() assessment: Assessment;

  itemsLength: number;
  pageTitle: string;

  breadcrumbs$: Observable<iTalBreadcrumb[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _sBs = new SubSink();

  constructor(
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
