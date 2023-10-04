import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Survey } from '@app/model/convs-mgr/conversations/surveys';

import { DeleteSurveyModalComponent } from '../../modals/delete-survey-modal/delete-survey-modal.component';


@Component({
  selector: 'app-survey-grid-view',
  templateUrl: './survey-grid-view.component.html',
  styleUrls: ['./survey-grid-view.component.scss'],
})
export class SurveyGridViewComponent implements OnInit{
  @Input() dataSource: MatTableDataSource<Survey>;
  @Input() surveys: Survey[];

  constructor(private _router: Router,
              private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openSurvey(surveyId: string) {
    this._router.navigate(['/surveys', surveyId]);
  }

  openSurveyResults(surveyId: string) {
    this._router.navigate(['/surveys', surveyId, 'results']);
  }

  openDeleteModal(survey: Survey) {
    this._dialog.open(DeleteSurveyModalComponent, {
      data: { survey },
      panelClass: 'delete-survey-container',
    });
  }
}
