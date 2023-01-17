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
import { ConvsMgrTextMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/text-message-block';
import { ConvsMgrListMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/list-message-block'

import { MultipleInputBlockComponent } from './components/multiple-input-block/multiple-input-block.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    ConvsMgrTextMessageBlockModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,
    ConvsMgrBlockOptionsModule,
    ConvsMgrListMessageBlockModule
  ],

  declarations: [
    MultipleInputBlockComponent
  ],

  exports: [
    MultipleInputBlockComponent, 
    ConvsMgrListMessageBlockModule
  ],
})
export class ConvsMgrMultipleInputMessageBlockModule {}
