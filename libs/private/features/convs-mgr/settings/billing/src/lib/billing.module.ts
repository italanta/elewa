import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './components/billing/billing.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { AddPaymentDialogComponent } from './modals/add-payment-dialog/add-payment-dialog.component';
import { EditPaymentDialogComponent } from './modals/edit-payment-dialog/edit-payment-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
  ],
  declarations: [
    BillingComponent,
    AddPaymentDialogComponent,
    EditPaymentDialogComponent,
  ],
  exports: [BillingComponent],
})
export class BillingModule {}
