import { Component, OnInit } from '@angular/core';
import { AfterInactivityComponent } from '../../modals/after-inactivity/after-inactivity.component';
import { MilestoneReachedComponent } from '../../modals/milestone-reached/milestone-reached.component';
import { SpecificTimeComponent } from '../../modals/specific-time/specific-time.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageTemplateStore, ScheduleMessageService } from '@app/private/state/message-templates';
import { Router } from '@angular/router';
@Component({
  selector: 'app-single-mesage-template-settings',
  templateUrl: './single-mesage-template-settings.component.html',
  styleUrls: ['./single-mesage-template-settings.component.scss'],
})
export class SingleMesageTemplateSettingsComponent implements OnInit{
  selectedOption: string;
  selectedTime: string;
  messageTemplateFrequency = [
    { value: 'milestone', viewValue: 'Milestone reached' },
    { value: 'specific-time', viewValue: 'Send message at specific time' },
    { value: 'inactivity', viewValue: 'After inactivity' },
  ];
  action: string;
  canBeScheduled = false;
  
  constructor(
    private _dialog: MatDialog, 
    private _messageTemplateStore: MessageTemplateStore,
    private _scheduleMessageService: ScheduleMessageService,
    private _route$$: Router,

    ){}

    ngOnInit(): void {
      this.action = this._route$$.url.split('/')[2];

      if (this.action !== 'create') {

        console.log(this.action)
      } 
    }

  openModal() {
    switch (this.selectedOption) {
      case 'milestone':
        const dialogRef1 = this._dialog.open(MilestoneReachedComponent);

        dialogRef1.componentInstance?.milestoneSelected.subscribe(
          (selectedData: any) => {
            console.log('Selected Milestone Data:', selectedData);
            const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'milestone');
            if (specificTimeOption) {
              specificTimeOption.viewValue = `${selectedData.milestoneType} ${selectedData.selectedMilestone} - ${selectedData.selectedStory.name}`;
            }
          }
        );
        break;
      case 'specific-time':
        const dialogRef = this._dialog.open(SpecificTimeComponent);
  
        dialogRef.componentInstance?.dateTimeSelected.subscribe((selectedDateTime: any) => {
          console.log(selectedDateTime)
          this.selectedTime = selectedDateTime.date.toLocaleString();
          const formattedDateTime = `Send message at ${selectedDateTime.time} ${selectedDateTime.date.toLocaleString()}`;
          // Update the 'specific-time' option viewValue
          const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'specific-time');
          if (specificTimeOption) {
            specificTimeOption.viewValue = formattedDateTime;
          }
        });
        break;
      case 'inactivity':
        const inactivityDialogRef = this._dialog.open(AfterInactivityComponent);

        inactivityDialogRef.componentInstance?.timeInHoursSelected.subscribe(
          (selectedTime: number) => {
            console.log(`Selected time in hours: ${selectedTime}`);
            // Process the selected time in hours as needed
            const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'inactivity');
            if (specificTimeOption) {
              specificTimeOption.viewValue = `Send message after ${selectedTime} of inactivity.`;
            }
          }
        );
        break;
      default:
        break;
    }
  }

  saveSchedule(){
    const scheduleRequest = {
      messageId: this.action,
      channelId: '',
      dispatchTime: this.selectedTime,
    };
    // this._messageTemplateStore.createScheduledMessage(scheduleRequest)
    this._scheduleMessageService.scheduleMessage(scheduleRequest).subscribe((response) => {
      console.log(response)
    });
  }
  
}
