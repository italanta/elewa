import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';

@Component({
  selector: 'app-fallback-main-page',
  templateUrl: './fallback-main-page.component.html',
  styleUrls: ['./fallback-main-page.component.scss'],
})
export class FallbackMainPageComponent {
  constructor(public dialog: MatDialog) {}

  openModal() {
    this.dialog.open(FallbackModalComponent, {
      height: '600px',
      width: '600px',
    });
  }
}
