import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';

import { AfterInactivityModalComponent } from '../../modals/after-inactivity-modal/after-inactivity-modal.component';
import { SpecificTimeModalComponent } from '../../modals/specific-time-modal/specific-time-modal.component';
import { MilestoneReachedModalComponent } from '../../modals/milestone-reached-modal/milestone-reached-modal.component';
import { frequencyOptions } from '../../utils/constants';

@Component({
  selector: 'app-message-template-single-settings',
  templateUrl: './message-template-single-settings.component.html',
  styleUrls: ['./message-template-single-settings.component.scss'],
})
export class MessageTemplateSingleSettingsComponent implements OnInit{
  selectedTime: Date;

  selectedOption: string;
  action: string;

  canBeScheduled: boolean;

  messageTemplateFrequency = frequencyOptions;
  
  constructor(
    private _dialog: MatDialog, 
    private _route$$: Router,
    private _messageService: MessageTemplatesService

    ){}

    ngOnInit(): void {
      this.action = this._route$$.url.split('/')[2];
    }

  openMilestoneModal() {
  const dialogRef = this._dialog.open(MilestoneReachedModalComponent);

  dialogRef.componentInstance?.milestoneSelected.subscribe((selectedData: any) => {
    const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'milestone');
    if (specificTimeOption) {
      specificTimeOption.viewValue = `${selectedData.milestoneType} ${selectedData.selectedMilestone} - ${selectedData.selectedStory.name}`;
    }
    });
  }

  openSpecificTimeModal() {
    const dialogRef = this._dialog.open(SpecificTimeModalComponent);

    dialogRef.componentInstance?.dateTimeSelected.subscribe((selectedDateTime: any) => {
      this.selectedTime = selectedDateTime.date;
      const formattedDateTime = `Send message at ${selectedDateTime.time} ${selectedDateTime.date.toLocaleString()}`;
      
      const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'specific-time');
      if (specificTimeOption) {
        specificTimeOption.viewValue = formattedDateTime;
      }
    });
  }

  openInactivityModal() {
    const dialogRef = this._dialog.open(AfterInactivityModalComponent);
    
    dialogRef.componentInstance?.timeInHoursSelected.subscribe((selectedTime: number) => {
      const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'inactivity');
      if (specificTimeOption) {
        specificTimeOption.viewValue = `Send message after ${selectedTime} of inactivity.`;
      }
    });
  }

  openModal() {
    switch (this.selectedOption) {
      case 'milestone':
        this.openMilestoneModal();
        break;
      case 'specific-time':
        this.openSpecificTimeModal();
        break;
      case 'inactivity':
        this.openInactivityModal();
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
