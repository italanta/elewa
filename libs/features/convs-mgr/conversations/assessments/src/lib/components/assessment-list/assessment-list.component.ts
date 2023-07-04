import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';

import { SubSink } from 'subsink';
import { Observable, map, switchMap, tap } from 'rxjs';
import { TranslateService } from '@ngfi/multi-lang';
import { __DateFromStorage } from '@iote/time';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { EndUserDetails, EndUserService } from '@app/state/convs-mgr/end-users';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { CreateAssessmentModalComponent } from '../../modals/create-assessment-modal/create-assessment-modal.component';
import { DeleteAssessmentModalComponent } from '../../modals/delete-assessment-modal/delete-assessment-modal.component';
import { AssessmentDataSource } from '../../data-source/assessment-data-source.class';


@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent implements OnInit, OnDestroy {
  assessments$: Observable<Assessment[]>;

  assessmentsColumns = ['num', 'title', 'createdOn', 'inProgress', 'responses', 'actions'];

  dataSource: AssessmentDataSource;

  dataFound = true;

  private _sBs = new SubSink();

  @ViewChild(MatSort) set matSort(sort: MatSort){
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator){
    this.dataSource.paginator = paginator;
  }

  constructor(
    private _assessments: AssessmentService,
    private _endUserService: EndUserService,
    private _dialog: MatDialog,
    private _liveAnnounce: LiveAnnouncer,
    private _translate: TranslateService,
    private _router: Router
  ){}

  ngOnInit(): void {
    this.assessments$ = this._assessments.getAssessments$();
    this.dataSource = new AssessmentDataSource(this.assessments$);
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
                return (assessment.metrics = this.computeMetrics(endUsers,assessment));
              });
            })
          );
        })
      )
      .subscribe();
  }

  computeMetrics(endUsers: EndUserDetails[], assessment: Assessment) {
    let inProgress = 0;
    let completedRes = 0;

    endUsers.map((user) => {
      if (!user.cursor[0].assessmentStack) return;

      const assessExists = user.cursor[0].assessmentStack.find((assess) => assess.assessmentId === assessment.id);

      if (!assessExists) return 
      assessExists.finishedOn ? completedRes += 1 : inProgress += 1
    });

    return { inProgress, completedRes }
  }

  openAssessment(assessmentId: string) {
    this._router.navigate(['/assessments', assessmentId]);
  }

  openAssessmentResults(assessmentId: string) {
    this._router.navigate(['/assessments', assessmentId, 'results']);
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
    this.dataFound = (this.dataSource.filteredData.length > 0);
  }

  openCreateAssessmentDialog(){
    this._dialog.open(CreateAssessmentModalComponent);
  }

  // For assistive technology to be notified of table sorting changes
  onSortChange(sort: Sort){
    if(sort.direction == 'asc'){
      this._liveAnnounce.announce(this._translate.translate('ASSESSMENTS.ACCESSIBILITY.SORTED-ASC'));
    } else if(sort.direction == 'desc'){
      this._liveAnnounce.announce(this._translate.translate('ASSESSMENTS.ACCESSIBILITY.SORTED-DESC'));
    }
  }

  getFormattedDate(date: Date){
    const newDate = __DateFromStorage(date as Date);
    return newDate.format('DD/MM/YYYY HH:mm');
  }

  openDeleteModal(assessment: Assessment) {
    this._dialog.open(DeleteAssessmentModalComponent, {
      data: { assessment },
      panelClass: 'delete-assessment-container',
    });
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
