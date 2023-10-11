import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import {
  MessageTemplateStore,
  MessageTemplatesService,
  ScheduleMessageService,
  ScheduledMessageStore,
} from '@app/private/state/message-templates';
import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { MessageTemplateHomeComponent } from './pages/message-template-home/message-template-home.component';
import { MessageTemplateHelpComponent } from './pages/message-template-help/message-template-help.component';
import { MessageTemplateCreateComponent } from './pages/message-template-create/message-template-create.component';
import { MessageTemplateFormComponent } from './components/message-template-form/message-template-form.component';
import { MessageTemplateHeaderComponent } from './components/message-template-header/message-template-header.component';
import { MessageTemplateListComponent } from './components/message-template-list/message-template-list.component';
import { MessageTemplateSingleSettingsComponent } from './components/message-template-single-settings/message-template-single-settings.component';
import { MessageTemplateSingleComponent } from './components/message-template-single/message-template-single.component';
import { SpecificTimeModalComponent } from './modals/specific-time-modal/specific-time-modal.component';
import { AfterInactivityModalComponent } from './modals/after-inactivity-modal/after-inactivity-modal.component';
import { MilestoneReachedModalComponent } from './modals/milestone-reached-modal/milestone-reached-modal.component';
import { MessageTemplateRouterModule } from './message-template.router';
import { ChannelService, ChannelsStore } from '@app/private/state/organisation/channels';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    MessageTemplateRouterModule,
    MaterialBricksModule,
    MultiLangModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    MessageTemplateHomeComponent,
    MessageTemplateHelpComponent,
    MessageTemplateCreateComponent,
    MessageTemplateFormComponent,
    MessageTemplateHeaderComponent,
    MessageTemplateListComponent,
    MessageTemplateSingleSettingsComponent,
    MessageTemplateSingleComponent,
    SpecificTimeModalComponent,
    AfterInactivityModalComponent,
    MilestoneReachedModalComponent,
  ],
  providers: [
    MessageTemplatesService, 
    MessageTemplateStore,
    ScheduleMessageService,
    ScheduledMessageStore,
    ChannelService,
    ChannelsStore
  ],

})
export class ConvsMgrMessageTemplatesModule {}
