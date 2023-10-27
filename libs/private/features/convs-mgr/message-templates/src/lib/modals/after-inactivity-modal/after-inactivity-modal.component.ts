import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-after-inactivity-modal',
  templateUrl: './after-inactivity-modal.component.html',
  styleUrls: ['./after-inactivity-modal.component.scss'],
})
export class AfterInactivityModalComponent {
  selectedTimeInDays = 2; 
  selectedTimeUnit = 'days'; 

  @Output() timeInHoursSelected = new EventEmitter<number>();

  constructor(private _dialog: MatDialog){}

  onSaveClick() {
    const timeInHours = this.selectedTimeInDays * 24;

    this.timeInHoursSelected.emit(timeInHours);

    this._dialog.closeAll();
  }
}
