import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-after-inactivity-modal',
  templateUrl: './after-inactivity-modal.component.html',
  styleUrls: ['./after-inactivity-modal.component.scss'],
})
export class AfterInactivityModalComponent {
  selectedTime: FormControl; 
  selectedTimeUnit = 'days';
  isDays = true; 

  @Output() timeInHoursSelected = new EventEmitter<number>();

  constructor(private _dialog: MatDialog){
    this.selectedTime = new FormControl(1)
    
  }

  onSaveClick() {
    let timeInHours: number;

    if(this.isDays){
      timeInHours = this.selectedTime.value * 24;
    } else {
      timeInHours =  this.selectedTime.value
    }

    this.timeInHoursSelected.emit(timeInHours);

    this._dialog.closeAll();
  }

  toggleMode() {
    if(this.isDays) {
      this.isDays = false;
    } else {
      this.isDays = true;
    }
  }
}
