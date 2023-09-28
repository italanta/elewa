import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewUserDialogComponent } from 'libs/private/features/convs-mgr/settings/users/src/lib/modals/new-user-dialog/new-user-dialog.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})


export class BillingComponent {

  constructor(private dialog: MatDialog){}

  displayedColumns: string[] = ['position', 'name', 'weight', ''];
  dataSource = ELEMENT_DATA;

  addPaymentMethod() {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      minWidth: '500px',
      minHeight: '200px',
      
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},

];


