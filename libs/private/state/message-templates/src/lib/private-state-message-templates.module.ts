import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplateStore } from './store/message-template.store';
import { MessageTemplatesService } from './service/message-template.service';
import { ScheduleMessageService } from './service/schedule-message.service';
import { ScheduledMessageStore } from './store/scheduled-message.store';
import { ChannelService, ChannelsStore } from '@app/private/state/organisation/channels';
import { MilestoneTriggersService } from './service/milestone-triggers.service';
import { MilestoneTriggersStore } from './store/milestone-trigger.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    MessageTemplateStore,
    MessageTemplatesService,
    ScheduleMessageService,
    ScheduledMessageStore,
    ChannelService,
    ChannelsStore,
    MilestoneTriggersService,
    MilestoneTriggersStore
  ]
})
export class PrivateStateMessageTemplatesModule {}
