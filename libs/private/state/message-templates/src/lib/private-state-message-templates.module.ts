import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplatesService } from './services/message-template.service';
import { MessageTemplateStore } from './store/message-template.store';
import { ActiveMessageTemplateStore } from './store/active-message-template.store';
import { ScheduleMessageService } from './services/schedule-message.service';
import { ScheduledMessageStore } from './store/scheduled-messages.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    MessageTemplatesService,
    MessageTemplateStore,
    ActiveMessageTemplateStore,
    ScheduleMessageService,
    ScheduledMessageStore
  ]
})
export class PrivateStateMessageTemplatesModule {}
