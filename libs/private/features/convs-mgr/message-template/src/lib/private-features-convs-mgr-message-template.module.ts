import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplateHomeComponent } from './pages/message-template-home/message-template-home/message-template-home.component';
import { MessageTemplateFormComponent } from './components/message-template-form/message-template-form/message-template-form.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MessageTemplateHomeComponent, MessageTemplateFormComponent],
})
export class PrivateFeaturesConvsMgrMessageTemplateModule {}
