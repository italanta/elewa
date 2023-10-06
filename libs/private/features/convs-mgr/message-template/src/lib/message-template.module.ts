import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplateHomeComponent } from './pages/message-template-home/message-template-home.component';
import { MessageTemplateFormComponent } from './components/message-template-form/message-template-form.component';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { MessageTemplateRouterModule } from './message-template.router.module';
import { MessageTemplateListComponent } from './components/message-template-list/message-template-list.component';
import { MessageTemplateHeaderComponent } from './components/message-template-header/message-template-header.component';
import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MessageTemplateCreateComponent } from './pages/message-template-create/message-template-create.component';
import { MessageTemplateViewComponent } from './pages/message-template-help/message-template-view.component';
import {
  MessageTemplateStore,
  MessageTemplatesService,
  ActiveMessageTemplateStore,
  ScheduleMessageService,
  ScheduledMessageStore,
} from '@app/private/state/message-templates';
import { SingleMesageTemplateComponent } from './components/single-mesage-template/single-mesage-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleMesageTemplateSettingsComponent } from './components/single-mesage-template-settings/single-mesage-template-settings.component';
import { MilestoneReachedComponent } from './modals/milestone-reached/milestone-reached.component';
import { SpecificTimeComponent } from './modals/specific-time/specific-time.component';
import { AfterInactivityComponent } from './modals/after-inactivity/after-inactivity.component';
import { TemplateFormDropdownComponent } from './components/template-form-dropdown/template-form-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    MessageTemplateRouterModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    MessageTemplateHomeComponent,
    MessageTemplateFormComponent,
    MessageTemplateListComponent,
    MessageTemplateHeaderComponent,
    MessageTemplateCreateComponent,
    MessageTemplateViewComponent,
    SingleMesageTemplateComponent,
    SingleMesageTemplateSettingsComponent,
    MilestoneReachedComponent,
    SpecificTimeComponent,
    AfterInactivityComponent,
    TemplateFormDropdownComponent,
  ],
  providers: [
    MessageTemplatesService,
    MessageTemplateStore,
    ActiveMessageTemplateStore,
    ScheduleMessageService,
    ScheduledMessageStore
  ],
})
export class MessageTemplateModule {}
