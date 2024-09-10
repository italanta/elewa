import { v4 as uuid } from 'uuid';

import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { JobTypes, ScheduleOptionType, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { ScheduleMessageService } from '@app/private/state/message-templates';
import { Router } from '@angular/router';
import { TemplateMessage } from '@app/model/convs-mgr/conversations/messages';

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
              private _route$$: Router,
              private _scheduleMessageService: ScheduleMessageService,
              @Inject(MAT_DIALOG_DATA) public data: {schedule: ScheduledMessage, template: TemplateMessage}
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
      objectID: this.data.template.id,
      channelId: this.data.template.channelId as string,
      inactivityTime: timeInHours,
      scheduleOption: ScheduleOptionType.Inactivity,
      type: JobTypes.SimpleMessage,
      scheduledOn: new Date()
    }

    this.timeInHoursSelected.emit({data: schedule});

    if(this.data.schedule) {
      schedule.id = this.data.schedule.id;
      this._scheduleMessageService.updateScheduledMesssage(schedule).subscribe();
    } else {
      this._scheduleMessageService.addScheduledMesssage(schedule).subscribe();
    }

    const optionsPayload = {
      schedule,
      template: this.data.template
    }
    
    // Set the schedule configuration so that it can be accessed from the 
    //  learners page
    this._scheduleMessageService.setOptions(optionsPayload);
    
    this._dialog.afterAllClosed.subscribe(() => this.goToLearnersPage());

    this._dialog.closeAll();
  }

  goToLearnersPage(){
    this._route$$.navigate(['/users']);
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
