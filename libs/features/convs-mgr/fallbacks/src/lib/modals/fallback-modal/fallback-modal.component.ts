import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActionTypesArray } from '@app/model/convs-mgr/fallbacks';

@Component({
  selector: 'app-fallback-modal',
  templateUrl: './fallback-modal.component.html',
  styleUrls: ['./fallback-modal.component.scss'],
})
export class FallbackModalComponent {

  actionTypes = ActionTypesArray
  
  constructor(public dialogRef: MatDialogRef<FallbackModalComponent>) {}
}
