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

import { KeywordJumpBlockComponent } from './components/keyword-jump-block/keyword-jump-block.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ConvsMgrBlockOptionsModule,
  ],
  declarations: [KeywordJumpBlockComponent],
  exports: [KeywordJumpBlockComponent],
})
export class ConvsMgrKeywordJumpBlockModule {}
