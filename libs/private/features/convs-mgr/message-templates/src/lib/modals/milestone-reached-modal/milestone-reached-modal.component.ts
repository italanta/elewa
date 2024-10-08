import { v4 as uuid } from 'uuid';

import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, map } from 'rxjs';

import { ScheduleOptionType, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { MilestoneTriggersService, ScheduleMessageService } from '@app/private/state/message-templates';
import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { Story } from '@app/model/convs-mgr/stories/main';

import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { TemplateMessage } from '@app/model/convs-mgr/conversations/messages';
import { MilestoneTriggers } from '@app/model/convs-mgr/conversations/admin/system';

@Component({
  selector: 'app-milestone-reached-modal',
  templateUrl: './milestone-reached-modal.component.html',
  styleUrls: ['./milestone-reached-modal.component.scss'],
})
export class MilestoneReachedModalComponent implements OnInit {
  @Output() milestoneSelected = new EventEmitter<ScheduledMessage>();

  stories$: Observable<Story[]>;
  story: Story;
  blocks$: Observable<StoryBlock[]>;
  _sBS = new SubSink();
  action: string;

  selectedMilestone: EventBlock; 

  constructor(
    private _stories$$: StoriesStore,
    private _dialog: Dialog,
    private _storyBlockStore: StoryBlocksStore,
    private _route$$: Router,
    private _milestoneTriggerService: MilestoneTriggersService,
    private _scheduleMessageService: ScheduleMessageService,
    @Inject(MAT_DIALOG_DATA) public data: {schedule: ScheduledMessage, template: TemplateMessage}
  ) {
    this.stories$ = this._stories$$.get();
  }

  ngOnInit(): void {
    this.action = this._route$$.url.split('/')[2];
    this.patchValues();
  }

  selectedBot() {
    const storyId = this.story.id as string;
    this.blocks$ = this._storyBlockStore
      .getBlocksByStory(storyId, this.story.orgId)
      .pipe(
        map((b) => b.filter((block) => block.type === 30)),
        map((b) => b.filter((block: EventBlock) => block.isMilestone))
      );
  }

  onSaveClick() {
    const selectedStory = this.story;
    const selectedMilestone = this.selectedMilestone;
    const scheduleId = uuid();

    // Save the milestone schedule
    const schedule: ScheduledMessage = {
      id: scheduleId,
      channelId: this.data.template.channelId as string,
      objectID: this.data.template.id,
      milestone: {story: selectedStory, selectedMilestone},
      scheduleOption: ScheduleOptionType.Milestone
    }
    
    if(this.data.schedule) {
      schedule.id = this.data.schedule.id;
      this._sBS.sink = this._scheduleMessageService.updateScheduledMesssage(schedule).subscribe();

    } else {
      this._sBS.sink = this._scheduleMessageService.addScheduledMesssage(schedule).subscribe();
    }
    
    this.milestoneSelected.emit(schedule);

    this._dialog.closeAll(); // Close the modal
  }

  saveMilestone(schedule: ScheduledMessage) {
    const milestoneTriggerRequest: MilestoneTriggers = {
        id: schedule.id as string,
        message: this.data.template,
        eventName: schedule.milestone.selectedMilestone,
        usersSent: 0 
    }
    this._sBS.sink = this._milestoneTriggerService.addMilestoneTrigger(milestoneTriggerRequest).subscribe()

    // TODO: save scheduled messages
  }

  patchValues() {
    if(this.data.schedule) {
      this.story = this.data.schedule.milestone.story
      this.selectedMilestone = this.data.schedule.milestone.selectedMilestone
    }
  }

  closeModal(){
    this._dialog.closeAll();
  }
}
