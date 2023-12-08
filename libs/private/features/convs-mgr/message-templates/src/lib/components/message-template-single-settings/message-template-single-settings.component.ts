import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { take } from 'rxjs/operators';

import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { JobTypes, MessageTemplate, MessageTypes, ScheduleOptionType, ScheduleOptions, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService, MilestoneTriggersService, ScheduleMessageService } from '@app/private/state/message-templates';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { MilestoneTriggers } from '@app/model/convs-mgr/conversations/admin/system';

import { AfterInactivityModalComponent } from '../../modals/after-inactivity-modal/after-inactivity-modal.component';
import { SpecificTimeModalComponent } from '../../modals/specific-time-modal/specific-time-modal.component';
import { MilestoneReachedModalComponent } from '../../modals/milestone-reached-modal/milestone-reached-modal.component';
import { frequencyOptions } from '../../utils/constants';
import { getHumanReadableSchedule } from '../../utils/readable-schedule.util';

@Component({
  selector: 'app-message-template-single-settings',
  templateUrl: './message-template-single-settings.component.html',
  styleUrls: ['./message-template-single-settings.component.scss'],
})
export class MessageTemplateSingleSettingsComponent implements OnInit, OnDestroy {
  selectedTime: Date;
  inactivityTime: number;
  selectedMilestone: EventBlock;
  messageTemplateId: string;
  schedules: ScheduledMessage[] = [];

  // Milestone schedule
  mtSchedule: ScheduledMessage;

  specificTimeSchedule: ScheduledMessage;
  inactivitySchedule: ScheduledMessage;
  limit = 1;

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
    // TODO: Capture message template id from previous tab
    this.messageTemplateId = this.action.split('?')[0];
    this.getScheduleConditions()
  }

  getScheduleConditions() {
    this._scheduleMessageService.getScheduledMessages$().subscribe((schedules)=> {
      this.schedules = schedules;
    });
  }

  openMilestoneModal(schedule?: ScheduledMessage) {
  const dialogRef = this._dialog.open(MilestoneReachedModalComponent, {
    data: {schedule: schedule, templateId: this.messageTemplateId},
  });

  dialogRef.componentInstance?.milestoneSelected.subscribe((schedule: any) => {
    this.mtSchedule = schedule;
    });
  }

  openSpecificTimeModal(schedule?: ScheduledMessage) {
    const dialogRef = this._dialog.open(SpecificTimeModalComponent, {
      data: {schedule: schedule, templateId: this.messageTemplateId},
    });

    dialogRef.componentInstance?.dateTimeSelected.subscribe((schedule: any) => {
      this.specificTimeSchedule = schedule.data;
      this.selectedTime = schedule.data.dispatchTime as Date;
      this.cronSchedule = schedule.data.frequency as string;
      this.endDate = schedule.data.endDate as Date;
    });
  }

  getReadableFormat(schedule: ScheduleOptions) {
    return getHumanReadableSchedule(schedule)
  }

  deleteSchedule(schedule: ScheduledMessage){
    this._sBS.sink = this._scheduleMessageService.removeScheduledMesssage(schedule)
        .pipe(take(1))
          .subscribe();

    if(schedule.scheduleOption == ScheduleOptionType.Milestone) {
     this._sBS.sink = this._milestoneTriggerService.removeMilestoneTrigger(schedule.id as string)
          .pipe(take(1))
            .subscribe();
    }
  }

  openInactivityModal(schedule?: ScheduledMessage) {
    const dialogRef = this._dialog.open(AfterInactivityModalComponent, {
      data: {schedule: schedule, templateId: this.messageTemplateId},
    });
    
    dialogRef.componentInstance?.timeInHoursSelected.subscribe((schedule: any) => {
      this.inactivitySchedule = schedule.data;
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

  editModal(schedule: ScheduledMessage) {
    switch (schedule.scheduleOption) {
      case ScheduleOptionType.Milestone:
        this.openMilestoneModal(schedule);
        break;
      case ScheduleOptionType.SpecificTime:
        this.openSpecificTimeModal(schedule);
        break;
      case ScheduleOptionType.Inactivity:
        this.openInactivityModal(schedule);
        break;
      default:
        break;
    }
  }

  sendButtonClicked(scheduleMessageOptions: any, action: string){

    scheduleMessageOptions.type = JobTypes.SimpleMessage;
    scheduleMessageOptions.action = action;
    scheduleMessageOptions.objectID = scheduleMessageOptions.template.id;

    this._scheduleMessageService.setOptions(scheduleMessageOptions);

    this._route$$.navigate(['/learners']);
  }

  saveSchedule() {
    // TODO: Use interface
    let scheduleMessageOptions: any;

    if (this.selectedOption) {
      let templateMessage: MessageTemplate;
      this._messageService.getTemplateById(this.messageTemplateId).subscribe((template: any) => {
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
        id: this.mtSchedule.id as string,

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
      id: this.inactivitySchedule.id,
      template: templateMessage,
      inactivityTime: this.inactivityTime,
    }
  }
  _getSpecificTimeOptions(templateMessage: MessageTemplate) {
    return {
      id: this.specificTimeSchedule.id,
      template: templateMessage,
      dispatchDate: this.selectedTime,
      frequency: this.cronSchedule,
      endDate: this.endDate ? this.endDate : null,
    }
  }

  ngOnDestroy(): void {
    this._sBS.unsubscribe();
  }
}
