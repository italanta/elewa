import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { recurrenceOptions, weekdays } from '../../utils/constants';


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
  menuButtonText = 'Never'; 


    // Arrays to populate the "Repeat every" select dropdowns
    dailyOptions: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
    weeklyOptions: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
    monthlyOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

    // Add the weekdays array to your component
    weekdays = weekdays;

     // Define an array of radio option values
    recurrenceOptions = recurrenceOptions;

  
    // Properties for selected repeat values
    selectedDailyRepeat: number;
    selectedWeeklyRepeat: number;
    selectedMonthlyRepeat: number;

  


  constructor(
    private dialogRef: MatDialogRef<SpecificTimeModalComponent>, 
    private _route$$: Router,
    private _dialog: Dialog
    ) {}

  ngOnInit(): void {
    this.action = this._route$$.url.split('/')[2];
  }

  dateChanged(event: any): void {
    this.selectedDate = event.value;
  }

  onRecurrenceChange(selectedValue: string): void {
    this.selectedRecurrence = selectedValue;
    this.updateMenuButtonText();
  }
  

  updateMenuButtonText() {
    switch (this.selectedRecurrence) {
      case 'Never':
        this.menuButtonText = 'Never';
        break;
      case 'Daily':
        this.menuButtonText = 'Daily';
        break;
      case 'Weekly':
        this.menuButtonText = 'Weekly';
        break;
      case 'Monthly':
        this.menuButtonText = 'Monthly';
        break;
      default:
        this.menuButtonText = 'Menu'; // Default text
    }
  }

  removeEndDate() {
    // Set the input field value to an empty string to remove the date
    const dateInput = document.getElementById('birthday') as HTMLInputElement;
    dateInput.value = '';
  }

  toggleSelectedDay(day: string): void {
      if (this.selectedDays.includes(day)) {
          this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
          this.selectedDays.push(day);
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

  closeModal(){
    this._dialog.closeAll();
  }
}