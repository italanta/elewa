import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddPaymentDialogComponent } from '../../modals/add-payment-dialog/add-payment-dialog.component';
import { EditPaymentDialogComponent } from '../../modals/edit-payment-dialog/edit-payment-dialog.component';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}

export interface PaymentData {
  id: number;
  cardNumber: number;
  expiry: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "23 August 2023", name: 'Plan 1', weight: 1200, symbol: 'Download' },
  { position: "23 July 2023", name: 'Plan 1', weight: 1200, symbol: 'Download' },
  { position: "23 July 2023", name: 'plan 1', weight: 1200, symbol: 'Download' },
];

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {
  
  org: string;
  selectedOption = 'subscription'; 

  // Define ELEMENT_CARD as a property of the class
  ELEMENT_CARD: PaymentData[] = [
    { id: 1, cardNumber: 1234578908, expiry: '02/24' },
    { id: 2, cardNumber: 1234578909, expiry: '03/25' },
    { id: 3, cardNumber: 1234578910, expiry: '04/26' },
    { id: 4, cardNumber: 1234578911, expiry: '05/27' },
  ];

  constructor(private dialog: MatDialog) {}

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  addPaymentMethod() {
    const dialogRef = this.dialog.open(AddPaymentDialogComponent, {
      minWidth: '410px',
      minHeight: '338px',
      data: this.org,
    });
  }

  editPaymentMethod() {
    const dialogRef = this.dialog.open(EditPaymentDialogComponent, {
      minWidth: '500px',
      minHeight: '200px',
      data: this.org,
    });
  }

  // You can have a method to update the selected option based on user interaction
  selectOption(option: string) {
    this.selectedOption = option;
  }
}
