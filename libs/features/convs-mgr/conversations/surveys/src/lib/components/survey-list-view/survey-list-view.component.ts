import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TranslateService } from '@ngfi/multi-lang';
import { __DateFromStorage } from '@iote/time';
import { Survey } from '@app/model/convs-mgr/conversations/surveys';
import { DeleteSurveyModalComponent } from '../../modals/delete-survey-modal/delete-survey-modal.component';



@Component({
  selector: 'app-survey-list-view',
  templateUrl: './survey-list-view.component.html',
  styleUrls: ['./survey-list-view.component.scss'],
})
export class SurveyListViewComponent implements OnInit{
  @ViewChild(MatSort) set matSort(sort: MatSort){
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator){
    this.dataSource.paginator = paginator;
  }

  surveysColumns = ['num', 'title', 'status', 'questions', 'inProgress', 'responses', 'updatedOn', 'duplicate', 'actions'];

  @Input() dataSource: MatTableDataSource<Survey>;
  @Input() surveys: Survey[];

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

  openSurvey(surveyId: string) {
    this._router.navigate(['/surveys', surveyId]);
  }

  openSurveyResults(surveyId: string) {
    this._router.navigate(['/surveys', surveyId, 'results']);
  }

  getFormattedDate(date: Date){
    const newDate = __DateFromStorage(date as Date);
    return newDate.format('DD/MM/YYYY HH:mm');
  }

  openDeleteModal(survey: Survey) {
    this._dialog.open(DeleteSurveyModalComponent, {
      data: { survey },
      panelClass: 'delete-survey-container',
    });
  }
}
