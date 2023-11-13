import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplateStore } from './store/message-template.store';
import { ScheduledMessageStore } from './store/scheduled-message.store';
import { MilestoneTriggersStore } from './store/milestone-trigger.store';

@NgModule({
  imports: [CommonModule],
})
export class MessageTemplatesModule {
  static forRoot(): ModuleWithProviders<MessageTemplatesModule> {
    return {
      ngModule: MessageTemplatesModule,
      providers: [
        MessageTemplateStore,
        ScheduledMessageStore,
        MilestoneTriggersStore
      ]
    };
  }
}
