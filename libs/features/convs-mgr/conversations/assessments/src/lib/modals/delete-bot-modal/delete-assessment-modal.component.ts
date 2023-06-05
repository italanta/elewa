import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionService } from '@app/state/convs-mgr/conversations/assessments';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-delete-assessment-modal',
  templateUrl: './delete-assessment-modal.component.html',
  styleUrls: ['./delete-assessment-modal.component.scss'],
})
export class DeleteAssessmentModalComponent implements OnDestroy {
  private _sBs = new SubSink();

  constructor(
    private _dialog: MatDialog,
    private _assQuestionSer$: AssessmentQuestionService,
    @Inject(MAT_DIALOG_DATA) public data: { question: AssessmentQuestion }
  ) {}

  delete() {
    this._sBs.sink = this._assQuestionSer$.deleteQuestion$(this.data.question).subscribe(() => {
      this._dialog.closeAll();
    });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
