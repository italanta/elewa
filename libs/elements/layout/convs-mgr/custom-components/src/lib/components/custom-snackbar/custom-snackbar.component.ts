import { Component, inject, Inject } from '@angular/core';

import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss',
})
export class CustomSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {status: 'Warning' | 'Success' | 'Error'; text: string}) { }
}
