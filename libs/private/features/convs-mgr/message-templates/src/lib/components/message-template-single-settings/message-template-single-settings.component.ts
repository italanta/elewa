import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { JobTypes, MessageTemplate, MessageTypes, ScheduledMessage } from '@app/model/convs-mgr/functions';
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
  inactivityTime: number;
  selectedMilestone: EventBlock;

  _sBS = new SubSink();

  selectedOption: string;
  action: string;
  cronSchedule: string;
  endDate: Date;

  canBeScheduled: boolean;

  showMessageConditions :boolean;


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

    dialogRef.componentInstance?.dateTimeSelected.subscribe((schedule: any) => {
      this.selectedTime = schedule.date;
      this.cronSchedule = schedule.cron;
      this.endDate = schedule.endDate;

      const formattedDateTime = `Send message at ${schedule.time} ${schedule.date.toLocaleString()}`;
      
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
        this.inactivityTime = selectedTime;
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

  sendButtonClicked(scheduleMessageOptions: any, action: string){

    scheduleMessageOptions.type = JobTypes.SimpleMessage;
    scheduleMessageOptions.action = action;
    scheduleMessageOptions.id = scheduleMessageOptions.template.id;

    this._scheduleMessageService.setOptions(scheduleMessageOptions);

    this._route$$.navigate(['/learners']);
  }

  saveSchedule() {
    // TODO: Use interface
    let scheduleMessageOptions: any;

    if (this.selectedOption) {
      let templateMessage: MessageTemplate;
      // TODO: @Lemmy/Beryl Pass template id from query params
      this._messageService.getTemplateById(this.action.split('?')[0]).subscribe((template: any) => {
        templateMessage = template;
        if (templateMessage) {
          switch (this.selectedOption) {
            case 'specific-time':
              scheduleMessageOptions = this._getSpecificTimeOptions(templateMessage);

              this.sendButtonClicked(scheduleMessageOptions, 'specific-time');
              break;
            case 'milestone':
              this.saveMilestone(template);
              break;
            case 'inactivity':
              scheduleMessageOptions = this._getInactivityOptions(templateMessage);

              this.sendButtonClicked(scheduleMessageOptions, 'inactivity');
              break;
            default:
              this.openSpecificTimeModal();
              break;
          }
        }
      });
    }
  }
  
  saveMilestone(template: MessageTemplate) {
    const event:string = this.selectedMilestone.eventName as string;
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

    // TODO: save scheduled messages
  }

  _getInactivityOptions(templateMessage: MessageTemplate) {
    return {
      template: templateMessage,
      inactivityTime: this.inactivityTime,
    }
  }
  _getSpecificTimeOptions(templateMessage: MessageTemplate) {
    return {
      template: templateMessage,
      dispatchDate: this.selectedTime,
      frequency: this.cronSchedule,
      endDate: this.endDate ? this.endDate : null,
    }
  }
}
