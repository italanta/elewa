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

import { ListBlockComponent } from './components/list-block/list-block.component';

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
    ConvsMgrReusableTextAreaModule,
  ],

  declarations: [ListBlockComponent],

  exports: [ListBlockComponent],
})
export class ConvsMgrListMessageBlockModule {}
