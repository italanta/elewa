import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { map, take } from 'rxjs/operators';

import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { MessageTypes, ScheduleOptionType, ScheduleOptions, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService, MilestoneTriggersService, ScheduleMessageService } from '@app/private/state/message-templates';
import { TemplateMessage, TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
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
  messageTemplate: TemplateMessage;

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
    this._messageService.getTemplateById(this.messageTemplateId).subscribe((template)=> {
      if(template) this.messageTemplate = template;
    })
  }

  getScheduleConditions() {
    this._scheduleMessageService.getScheduledMessages$()
        .pipe(map((sch)=> sch.filter((s)=> s.objectID == this.messageTemplateId)))
            .subscribe((schedules)=> {
                this.schedules = schedules;
              });
  }

  openMilestoneModal(schedule?: ScheduledMessage) {
  const dialogRef = this._dialog.open(MilestoneReachedModalComponent, {
    data: {schedule: schedule, template: this.messageTemplate},
  });

  dialogRef.componentInstance?.milestoneSelected.subscribe((schedule: any) => {
    this.mtSchedule = schedule;
    });
  }

  openSpecificTimeModal(schedule?: ScheduledMessage) {
    this._dialog.open(SpecificTimeModalComponent, {
      data: {schedule: schedule, template: this.messageTemplate},
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
    this._dialog.open(AfterInactivityModalComponent, {
      data: {schedule: schedule, template: this.messageTemplate},
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
  
  saveMilestone(template: TemplateMessage) {
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

  ngOnDestroy(): void {
    this._sBS.unsubscribe();
  }
}
