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
import { MultipleInputBlockComponent } from './components/multiple-input-block/multiple-input-block.component';
import { AddMoreBlockComponent } from './components/add-more-block/add-more-block.component';
import { ConvsMgrTextMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/text-message-block';
import { GenericButtonComponent } from './components/generic-button/generic-button.component';
import { ConvsMgrListMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/list-message-block'

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
    MultipleInputBlockComponent,
    AddMoreBlockComponent,
    GenericButtonComponent,
  ],

  exports: [MultipleInputBlockComponent, AddMoreBlockComponent, GenericButtonComponent, ConvsMgrListMessageBlockModule],
})
export class ConvsMgrMultipleInputMessageBlockModule {}
