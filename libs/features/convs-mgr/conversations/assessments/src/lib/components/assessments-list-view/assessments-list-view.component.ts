import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TranslateService } from '@ngfi/multi-lang';
import { __DateFromStorage } from '@iote/time';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { DeleteAssessmentModalComponent } from '../../modals/delete-assessment-modal/delete-assessment-modal.component';

@Component({
  selector: 'app-assessments-list-view',
  templateUrl: './assessments-list-view.component.html',
  styleUrls: ['./assessments-list-view.component.scss'],
})
export class AssessmentsListViewComponent implements OnInit {

  @ViewChild(MatSort) set matSort(sort: MatSort){
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator){
    this.dataSource.paginator = paginator;
  }

  assessmentsColumns = ['num', 'title', 'status', 'questions', 'inProgress', 'responses', 'updatedOn', 'duplicate', 'actions'];

  @Input() dataSource: MatTableDataSource<Assessment>;
  @Input() assessments: Assessment[];

  constructor(private _router: Router,
              private _dialog: MatDialog,
              private _translate: TranslateService,
              private _liveAnnounce: LiveAnnouncer) {}

  ngOnInit(): void {}

  onSortChange(sort: Sort){
    if(sort.direction == 'asc'){
      this._liveAnnounce.announce(this._translate.translate('ASSESSMENTS.ACCESSIBILITY.SORTED-ASC'));
    } else if(sort.direction == 'desc'){
      this._liveAnnounce.announce(this._translate.translate('ASSESSMENTS.ACCESSIBILITY.SORTED-DESC'));
    }
  }

  openAssessment(assessmentId: string) {
    this._router.navigate(['/assessments', assessmentId]);
  }

  openAssessmentResults(assessmentId: string) {
    this._router.navigate(['/assessments', assessmentId, 'results']);
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
}
