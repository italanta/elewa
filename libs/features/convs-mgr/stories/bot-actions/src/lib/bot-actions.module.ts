import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ChatsRouterModule } from '@app/features/convs-mgr/conversations/chats';

import { ConnectToChannelModalComponent } from './modals/connect-to-channel-modal/connect-to-channel-modal.component';
import { SpinnerModalComponent } from './modals/spinner-modal/spinner-modal.component';
import { ChannelComponent } from './modals/channel/channel.component';
import { MainChannelModalComponent } from './modals/main-channel-modal/main-channel-modal.component';
import { ConfirmPublishModalComponent } from './modals/confirm-publish-modal/confirm-publish-modal.component';
import { ConfirmArchiveModalComponent } from './modals/confirm-archive-modal/confirm-archive-modal.component';
import { FilterCoursePipe } from './pipes/filter-course.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    ConvlPageModule,
    MultiLangModule,
    FormsModule,
    ItalBreadCrumbModule,
  ],
  declarations: [
    ConnectToChannelModalComponent,
    SpinnerModalComponent,
    ChannelComponent,
    MainChannelModalComponent,
    ConfirmPublishModalComponent,
    ConfirmArchiveModalComponent,

    FilterCoursePipe
  ],
  exports: [
    ConnectToChannelModalComponent,
    SpinnerModalComponent,
    ChannelComponent,
    MainChannelModalComponent,
    ConfirmPublishModalComponent,
    ConfirmArchiveModalComponent,

    FilterCoursePipe
  ]
})
export class BotActionsModule {}
