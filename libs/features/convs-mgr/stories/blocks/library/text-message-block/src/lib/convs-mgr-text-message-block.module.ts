import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { MessageBlockComponent } from './components/message-block/message-block.component';
import { TextMessageModule } from '../../../main/src/lib/components/text-message/text-message.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule,

    TextMessageModule
  ],

  declarations: [MessageBlockComponent],

  exports: [MessageBlockComponent],
})
export class ConvsMgrTextMessageBlockModule {}
