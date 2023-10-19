import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { MessageTemplate, MessageTypes, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService, MilestoneTriggersService, ScheduleMessageService } from '@app/private/state/message-templates';
import { TemplateMessage, TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { MilestoneTriggers } from '@app/model/convs-mgr/conversations/admin/system';

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
  selectedMilestone: EventBlock;

  _sBS = new SubSink();

  selectedOption: string;
  action: string;

  canBeScheduled: boolean;

  messageTemplateFrequency = frequencyOptions;
  
  displayedColumns: string[] = ['Date sent', 'Time sent', 'Number of learners', 'status', 'meta'];
  dataSource: MatTableDataSource<ScheduledMessage>;
  
  constructor(
    private _dialog: MatDialog, 
    private _route$$: Router,
    private _messageService: MessageTemplatesService,
    private _scheduleMessageService: ScheduleMessageService,
    private _milestoneTriggerService: MilestoneTriggersService

    ){}

    ngOnInit(): void {
      this.action = this._route$$.url.split('/')[2];
      this.fetchTemplateAndScheduledMessages();
    }

    fetchTemplateAndScheduledMessages() {
      this._messageService.getTemplateById(this.action).subscribe((template) => {
        if (template) {
          const templateName = template.name;
          this.filterMatchingScheduledMessages(templateName);
        }
      });
    }

    filterMatchingScheduledMessages(templateName: string) {
      this._scheduleMessageService.getScheduledMessages$().subscribe((scheduledMessages) => {
        const matchingScheduledMessages = scheduledMessages.filter((message) => message.message.name === templateName);
        this.dataSource = new MatTableDataSource<ScheduledMessage>(matchingScheduledMessages);
      });
    }

    isTimePast(time: Date){
      return time > new Date() ? 'Pending' : 'Sent';
    }

  openMilestoneModal() {
  const dialogRef = this._dialog.open(MilestoneReachedModalComponent);

  dialogRef.componentInstance?.milestoneSelected.subscribe((selectedData: any) => {
    const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'milestone');
    if (specificTimeOption) {
      specificTimeOption.viewValue = `${selectedData.selectedMilestone.eventName} - ${selectedData.selectedStory.name}`;
      this.selectedMilestone = selectedData.selectedMilestone;
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
        specificTimeOption.viewValue = `Send message after ${selectedTime} hours of inactivity.`;
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

  saveSchedule() {
    if (this.selectedOption) {
      let templateMessage: MessageTemplate;
  
      this._messageService.getTemplateById(this.action).subscribe((template: any) => {
        templateMessage = template;
  
        if (templateMessage) {
          switch (this.selectedOption) {
            case 'specific-time':
              this.sendButtonClicked(templateMessage, this.selectedTime);
              break;
            case 'milestone':
              this.saveMilestone(template);
              break;
            default:
              console.log('Unsupported option');
              break;
          }
        }
      });
    }
  }
  
  saveMilestone(template: MessageTemplate) {
    const event:string = this.selectedMilestone.eventName!;
    const milestoneTriggerRequest: MilestoneTriggers = {
        message: {
          templateType: TemplateMessageTypes.Text,
          type: MessageTypes.TEXT,
          name: template.name,
          language: template.language
        },
        eventName: event,
        usersSent:1
    }
    this._sBS.sink= this._milestoneTriggerService.addMilestoneTrigger(milestoneTriggerRequest).subscribe()
  }
  
}
