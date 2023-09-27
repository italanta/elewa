import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplatesService } from './services/message-template.service';
import { MessageTemplateStore } from './store/message-template.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    MessageTemplatesService,
    MessageTemplateStore
  ]
})
export class PrivateStateMessageTemplatesModule {}
