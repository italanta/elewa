import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { TranslateService} from '@ngfi/multi-lang';

/**
 * Delete Dialog.
 *
 * For no-pad mode,
 *    - inject { panelClass: 'modal-no-pad' } from calling parent.
 *    - inject data property noPad as true
 *    - Ensure .modal-no-pad .mat-dialog-container { padding: 0 } is part of theme
 *
 * @class DeleteConfirmationDialogComponent
 */
@Component({
  selector: 'iote-delete-confirmation-modal',
  templateUrl: 'delete-confirmation-modal.component.html',
  styleUrls: ['delete-confirmation-modal.component.scss']
})

export class DeleteConfirmationDialogComponent
{
  constructor(private _trl: TranslateService,
              public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { noPad?: boolean, content: string })
  { }

  closeModal(result: boolean): void {
    this.dialogRef.close(result);
  }
}
