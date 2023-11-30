import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { recurrenceOptions, weekdays } from '../../utils/constants';
import { ConvertToCron } from '../../utils/convert-to-cron.util';


@Component({
  selector: 'app-specific-time-modal',
  templateUrl: './specific-time-modal.component.html',
  styleUrls: ['./specific-time-modal.component.scss'],
})


export class SpecificTimeModalComponent {
  @Output() dateTimeSelected = new EventEmitter<{ date: Date, time: string, endDate?: Date ,cron: string }>();

  schedulerForm: FormGroup;
  
  selectedDate: Date;
  selectedTime: string;
  action: string;
  selectedRecurrence = 'Never'; 
  selectedDays: number[] = [];
  selectedMonthlyDays: number[] = [];
  menuButtonText = 'Never';
  cronFormat: string; 


    // Arrays to populate the "Repeat every" select dropdowns
    dailyOptions: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
    weeklyOptions: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
    monthlyOptions: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

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
    private _dialog: Dialog,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.action = this._route$$.url.split('/')[2];
    this.buildForm();
  }

  buildForm(){
    this.schedulerForm = this.fb.group({
      frequency: [''], // 'daily', 'weekly', 'monthly', etc.
      date: [''], // The start date
      time: [''], // specific time for daily
      daysOfWeek: [''], // for weekly
      daysOfMonth: [''], // for monthly
      interval: [null], // every x days/weeks/months
      endDate: ['']
    });
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
    this.schedulerForm.patchValue({endDate: null})
  }

  toggleSelectedDay(day: number): void {
      if (this.selectedDays.includes(day)) {
          this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
          this.selectedDays.push(day);
      }
  }

  toggleSelectedMonthlyDay(day: number): void {
      if (this.selectedMonthlyDays.includes(day)) {
          this.selectedMonthlyDays = this.selectedMonthlyDays.filter((d) => d !== day);
      } else {
          this.selectedMonthlyDays.push(day);
      }
  }

  
  saveDateTime(): void {
    this.schedulerForm.patchValue({
      daysOfWeek: this.selectedDays || [0],
      daysOfMonth: this.selectedMonthlyDays || [1]
    })

    this.selectedDate =  this.schedulerForm.value.date;
    this.selectedTime =  this.schedulerForm.value.time;
    const endDate = this.schedulerForm.value.endDate ? new Date(this.schedulerForm.value.endDate) : null;

    if (this.selectedDate && this.selectedTime) {
      const selectedDateTime = new Date(this.selectedDate);
      const timeParts = this.selectedTime.split(':');
      selectedDateTime.setHours(Number(timeParts[0]));
      selectedDateTime.setMinutes(Number(timeParts[1]));

      if(this.schedulerForm.value.frequency !== 'Never') {
        this.cronFormat = ConvertToCron(this.schedulerForm.value);
      }

      this.dateTimeSelected.emit({ date: selectedDateTime, time: this.selectedTime, endDate: endDate || undefined, cron: this.cronFormat });

      this.dialogRef.close();
    }

  }

  closeModal(){
    this._dialog.closeAll();
  }
}