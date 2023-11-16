import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-deactivate-user',
  templateUrl: './deactivate-user.component.html',
  styleUrls: ['./deactivate-user.component.scss'],
})
export class DeactivateUserComponent {
  constructor(
    private _dialog: MatDialog,
  ){}


  deactivateUser(){
    console.log("deactivated")
  }

  closeModal(){
    this._dialog.closeAll()
  }
}
