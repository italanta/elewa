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
import { TextMessageModule } from '../../../main/src/lib/components/text-message/text-message.module';

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

    TextMessageModule
  ],

  declarations: [
    ListBlockComponent
  ],

  exports: [
    ListBlockComponent
  ]
})

export class ConvsMgrListMessageBlockModule { }
