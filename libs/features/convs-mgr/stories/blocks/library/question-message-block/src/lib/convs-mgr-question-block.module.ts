import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { MultiLangModule } from '@ngfi/multi-lang';
import { QuestionsBlockComponent } from './components/questions-block/questions-block.component';
import { TextMessageModule } from '../../../main/src/lib/components/text-message-block/text-message.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MultiLangModule,

    FormsModule,
    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule,
    
    TextMessageModule
  ],

  declarations: [
    QuestionsBlockComponent
  ],

  exports: [
    QuestionsBlockComponent
  ]
})
export class ConvsMgrQuestionBlockModule {}
