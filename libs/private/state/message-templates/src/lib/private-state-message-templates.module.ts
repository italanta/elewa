import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplateStore } from './store/message-template.store';
import { MessageTemplatesService } from './service/message-template.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    MessageTemplateStore,
    MessageTemplatesService
  ]
})
export class PrivateStateMessageTemplatesModule {}
