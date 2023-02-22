import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { ReplyBlockComponent } from './components/reply-block/reply-block.component';
import { ConvsMgrTextMessageBlockModule } from '../../../text-message-block/src';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule,
    ConvsMgrTextMessageBlockModule
  ],

  declarations: [ReplyBlockComponent],

  exports: [ReplyBlockComponent],
})

export class ConvsMgrReplyMessageBlockModule { }