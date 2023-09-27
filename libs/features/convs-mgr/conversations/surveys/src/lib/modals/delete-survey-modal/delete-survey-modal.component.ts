import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Survey } from '@app/model/convs-mgr/conversations/surveys';
import { SurveyService } from '@app/state/convs-mgr/conversations/surveys';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-delete-survey-modal',
  templateUrl: './delete-survey-modal.component.html',
  styleUrls: ['./delete-survey-modal.component.scss'],
})
export class DeleteSurveyModalComponent implements OnDestroy{
  private _sBs = new SubSink();

  constructor(
    private _dialog: MatDialog,
    private _assSer$: SurveyService,
    @Inject(MAT_DIALOG_DATA) public data: { survey : Survey }
  ) {}

  delete() {
    this._sBs.sink = this._assSer$.deleteSurvey$(this.data.survey).subscribe(() => {
      this._dialog.closeAll();
    });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
