import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';

import { AfterInactivityModalComponent } from '../../modals/after-inactivity-modal/after-inactivity-modal.component';
import { SpecificTimeModalComponent } from '../../modals/specific-time-modal/specific-time-modal.component';
import { MilestoneReachedModalComponent } from '../../modals/milestone-reached-modal/milestone-reached-modal.component';

@Component({
  selector: 'app-message-template-single-settings',
  templateUrl: './message-template-single-settings.component.html',
  styleUrls: ['./message-template-single-settings.component.scss'],
})
export class MessageTemplateSingleSettingsComponent implements OnInit{
  selectedOption: string;
  selectedTime: Date;
  messageTemplateFrequency = [
    { value: 'milestone', viewValue: 'Milestone reached' },
    { value: 'specific-time', viewValue: 'Send message at specific time' },
    { value: 'inactivity', viewValue: 'After inactivity' },
  ];
  action: string;
  canBeScheduled = false;
  
  constructor(
    private _dialog: MatDialog, 
    private _route$$: Router,
    private _messageService: MessageTemplatesService

    ){}

    ngOnInit(): void {
      this.action = this._route$$.url.split('/')[2];
    }

  openModal() {
    switch (this.selectedOption) {
      case 'milestone':
        const dialogRef1 = this._dialog.open(MilestoneReachedModalComponent);

        dialogRef1.componentInstance?.milestoneSelected.subscribe(
          (selectedData: any) => {
            const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'milestone');
            if (specificTimeOption) {
              specificTimeOption.viewValue = `${selectedData.milestoneType} ${selectedData.selectedMilestone} - ${selectedData.selectedStory.name}`;
            }
          }
        );
        break;
      case 'specific-time':
        const dialogRef = this._dialog.open(SpecificTimeModalComponent);
  
        dialogRef.componentInstance?.dateTimeSelected.subscribe((selectedDateTime: any) => {
          this.selectedTime = selectedDateTime.date;
          const formattedDateTime = `Send message at ${selectedDateTime.time} ${selectedDateTime.date.toLocaleString()}`;
          // Update the 'specific-time' option viewValue
          const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'specific-time');
          if (specificTimeOption) {
            specificTimeOption.viewValue = formattedDateTime;
          }
        });
        break;
      case 'inactivity':
        const inactivityDialogRef = this._dialog.open(AfterInactivityModalComponent);

        inactivityDialogRef.componentInstance?.timeInHoursSelected.subscribe(
          (selectedTime: number) => {
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
  sendButtonClicked(template: MessageTemplate, selectedDate: Date){
    this._route$$.navigate(['/learners'], {queryParams: {templateId: template.id, dispatchDate: selectedDate}});
  }

  saveSchedule(){

    if (this.selectedTime){
      let templateMessage: MessageTemplate;
      this._messageService.getTemplateById(this.action).subscribe((template: any) => {
        templateMessage = template;
      
        if (templateMessage) {
          
        this.sendButtonClicked(templateMessage, this.selectedTime);
         
        }
      });
    }
    
;    
  }
}
