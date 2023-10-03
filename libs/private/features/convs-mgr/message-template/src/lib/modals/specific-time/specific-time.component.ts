import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-specific-time',
  templateUrl: './specific-time.component.html',
  styleUrls: ['./specific-time.component.scss'],
})
export class SpecificTimeComponent {
  selectedDate: Date;
  selectedTime: string;

  @Output() dateTimeSelected = new EventEmitter<{ date: Date, time: string }>();

  constructor(private dialogRef: MatDialogRef<SpecificTimeComponent>) {}

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
