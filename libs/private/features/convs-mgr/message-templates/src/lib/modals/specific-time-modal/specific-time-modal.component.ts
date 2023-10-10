import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specific-time-modal',
  templateUrl: './specific-time-modal.component.html',
  styleUrls: ['./specific-time-modal.component.scss'],
})
export class SpecificTimeModalComponent {
  @Output() dateTimeSelected = new EventEmitter<{ date: Date, time: string }>();

  selectedDate: Date;
  selectedTime: string;
  action: string;

  constructor(
    private dialogRef: MatDialogRef<SpecificTimeModalComponent>, 
    private _route$$: Router,
    ) {}

  ngOnInit(): void {
    this.action = this._route$$.url.split('/')[2];
  }

  dateChanged(event: any): void {
    this.selectedDate = event.value;
  }

  saveDateTime(): void {
    if (this.selectedDate && this.selectedTime) {
      const selectedDateTime = new Date(this.selectedDate);
      const timeParts = this.selectedTime.split(':');
      selectedDateTime.setHours(Number(timeParts[0]));
      selectedDateTime.setMinutes(Number(timeParts[1]));
      
      this.dateTimeSelected.emit({ date: selectedDateTime, time: this.selectedTime });

      this.dialogRef.close();
    }
  }
}
