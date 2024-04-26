import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fallback-modal',
  templateUrl: './fallback-modal.component.html',
  styleUrls: ['./fallback-modal.component.scss'],
})
export class FallbackModalComponent {
  constructor(public dialogRef: MatDialogRef<FallbackModalComponent>) {}
}
