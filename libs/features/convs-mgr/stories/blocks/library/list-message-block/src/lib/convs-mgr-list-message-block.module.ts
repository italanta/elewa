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

import { ListBlockComponent } from './components/list-block/list-block.component';
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

  declarations: [
    ListBlockComponent
  ],

  exports: [
    ListBlockComponent
  ]
})

export class ConvsMgrListMessageBlockModule { }
