import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { OpenEndedQuestionBlockComponent } from './components/open-ended-question-block/open-ended-question-block.component';
import { TextMessageModule } from '../../../main/src/lib/components/text-message-block/text-message.module';

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

  declarations: [OpenEndedQuestionBlockComponent],

  exports: [OpenEndedQuestionBlockComponent],
})
export class ConvsMgrOpenEndedQuestionBlockModule {}
