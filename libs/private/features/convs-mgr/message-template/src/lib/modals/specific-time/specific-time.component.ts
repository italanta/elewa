import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageTemplatesService } from '@app/private/state/message-templates';

@Component({
  selector: 'app-specific-time',
  templateUrl: './specific-time.component.html',
  styleUrls: ['./specific-time.component.scss'],
})
export class SpecificTimeComponent implements OnInit{
  selectedDate: Date;
  selectedTime: string;
  action: string;

  @Output() dateTimeSelected = new EventEmitter<{ date: Date, time: string }>();

  constructor(
    private dialogRef: MatDialogRef<SpecificTimeComponent>, 
    private _route$$: Router,
    private _messageTemplateService: MessageTemplatesService
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
      console.log(selectedDateTime,this.action );
      

      
      this.dateTimeSelected.emit({ date: selectedDateTime, time: this.selectedTime });

      this.dialogRef.close();
    }
  }
}
