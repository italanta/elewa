import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';
import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { ConditionalBlockComponent } from './component/conditional-block/conditional-block.component';
import { ConditionalBlockFormComponent } from './component/conditional-block-form/conditional-block-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiLangModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ConvsMgrBlockOptionsModule,
  ],
  declarations: [ConditionalBlockComponent, ConditionalBlockFormComponent],
  exports: [ConditionalBlockComponent, ConditionalBlockFormComponent],
})
export class ConvsMgrConditionalBlockModule {}
