import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngfi/multi-lang';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentService } from '../../services/assessment.service';


@Component({
  selector: 'convl-italanta-apps-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent implements OnInit, AfterViewInit, OnDestroy{
  assessments$: Observable<AssessmentQuestion[]>;
  assessments: AssessmentQuestion[];
  totalItems: number;

  assessmentsColumns = ['name', 'inProgress', 'responses', 'actions'];
  dataSource = new MatTableDataSource<AssessmentQuestion>

  private _sbS = new SubSink();

  @ViewChild(MatSort) tableSort: MatSort;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;

  constructor(private _assessments: AssessmentService,
              private _liveAnnounce: LiveAnnouncer,
              private _translate: TranslateService){}

  ngOnInit(): void {
    this.assessments$ = this._assessments.getAssessments$();
    this.initializeDataSource();
  }

  initializeDataSource(){
    this._sbS.sink = this.assessments$.subscribe(_assessments => {
      this.dataSource.data = _assessments;
      this.totalItems = _assessments.length;
    })
  }

  searchTable(event: Event){
    let searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  // For assistive technology to be notified of table sorting changes
  onSortChange(sort: Sort){
    if(sort.direction == 'asc'){
      this._liveAnnounce.announce(this._translate.translate('PAGE-CONTENT.ASSESSMENTS.ACCESSIBILITY.SORTED-ASC'));
    } else if(sort.direction == 'desc'){
      this._liveAnnounce.announce(this._translate.translate('PAGE-CONTENT.ASSESSMENTS.ACCESSIBILITY.SORTED-DESC'));
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.tableSort;
    this.dataSource.paginator = this.tablePaginator;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
