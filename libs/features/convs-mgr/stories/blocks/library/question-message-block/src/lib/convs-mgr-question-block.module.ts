import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { ConvsMgrReusableTextAreaModule } from '@app/features/convs-mgr/stories/blocks/library/reusable-text-area';

import { QuestionsBlockComponent } from './components/questions-block/questions-block.component';

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

    ConvsMgrReusableTextAreaModule,
  ],

  declarations: [QuestionsBlockComponent],

  exports: [QuestionsBlockComponent],
})
export class ConvsMgrQuestionBlockModule {}
