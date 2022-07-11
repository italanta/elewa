import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { TranslateService} from '@ngfi/multi-lang';

/**
 *  Dialog.
 *
 * For no-pad mode,
 *    - inject { panelClass: 'modal-no-pad' } from calling parent.
 *    - inject data property noPad as true
 *    - Ensure .modal-no-pad .mat-dialog-container { padding: 0 } is part of theme
 *
 * @class ConfirmationDialogComponent
 */
@Component({
  selector: 'iote-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
  styleUrls: ['confirmation-modal.component.scss']
})

export class ConfirmationDialogComponent
{
  confirmText: string;

  constructor(private _trl: TranslateService,
              public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { title: string,
                                                      content: string,
                                                      confirmActionText: string,
                                                      isCritical?: boolean
                                                    })
  {
    this.confirmText = this.data.confirmActionText ?? 'ACTIONS.CONFIRM-BTN';
  }

  closeModal(result: boolean): void {
    this.dialogRef.close(result);
  }
}
