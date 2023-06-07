import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-delete-assessment-modal',
  templateUrl: './delete-assessment-modal.component.html',
  styleUrls: ['./delete-assessment-modal.component.scss'],
})
export class DeleteAssessmentModalComponent implements OnDestroy {
  private _sBs = new SubSink();

  constructor(
    private _dialog: MatDialog,
    private _assSer$: AssessmentService,
    @Inject(MAT_DIALOG_DATA) public data: { assessment : Assessment }
  ) {}

  delete() {
    this._sBs.sink = this._assSer$.deleteAssessment$(this.data.assessment).subscribe(() => {
      this._dialog.closeAll();
    });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
