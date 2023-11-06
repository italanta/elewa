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
  selectedRecurrence = 'Never'; 
  selectedDays: string[] = [];

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

  onRecurrenceChange(event: any): void {
    this.selectedRecurrence = event.target.value;
}



  toggleSelectedDay(day: string): void {
      if (this.selectedDays.includes(day)) {
          this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
          this.selectedDays.push(day);
      }
  }

  scrollMonths(direction: 'left' | 'right') {
    const monthsContainer = document.querySelector('.months');
    if (monthsContainer) {
      if (direction === 'left') {
        monthsContainer.scrollLeft -= 100; // Adjust the scroll distance as needed
      } else {
        monthsContainer.scrollLeft += 100; // Adjust the scroll distance as needed
      }
    }
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
