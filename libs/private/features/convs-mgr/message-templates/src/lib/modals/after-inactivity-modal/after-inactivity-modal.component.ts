import { v4 as uuid } from 'uuid';

import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { ScheduleOptionType, ScheduleOptions, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { ScheduleMessageService } from '@app/private/state/message-templates';

@Component({
  selector: 'app-after-inactivity-modal',
  templateUrl: './after-inactivity-modal.component.html',
  styleUrls: ['./after-inactivity-modal.component.scss'],
})
export class AfterInactivityModalComponent {
  selectedTime: FormControl; 
  selectedTimeUnit = 'days';
  isDays = true; 

  @Output() timeInHoursSelected = new EventEmitter<{data: ScheduledMessage}>();

  constructor(private _dialog: MatDialog, 
              private _scheduleMessageService: ScheduleMessageService,
              @Inject(MAT_DIALOG_DATA) public data: {schedule: ScheduledMessage, templateId: string}
              ){
    this.selectedTime = new FormControl(1)
    
  }

  onSaveClick() {
    let timeInHours: number;

    if(this.isDays){
      timeInHours = this.selectedTime.value * 24;
    } else {
      timeInHours =  this.selectedTime.value
    }

    const schedule: ScheduledMessage = {
      id: uuid(),
      objectID: this.data.templateId,
      inactivityTime: timeInHours,
      scheduleOption: ScheduleOptionType.Inactivity,
      scheduledOn: new Date()
    }

    this.timeInHoursSelected.emit({data: schedule});

    if(this.data.schedule) {
      schedule.id = this.data.schedule.id;
      this._scheduleMessageService.updateScheduledMesssage(schedule).subscribe();
    } else {
      this._scheduleMessageService.addScheduledMesssage(schedule).subscribe();
    }

    this._dialog.closeAll();
  }

  patchValues() {
    if(this.data.schedule) { 
      this.selectedTime.patchValue((Math.floor(this.data.schedule.inactivityTime as number) / 24));
    }
  }

  toggleMode() {
    if(this.isDays) {
      this.isDays = false;
    } else {
      this.isDays = true;
    }
  }
}
