import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '../../../block-options/src';
import { FailBlockComponent } from './components/fail-block/fail-block.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule,
  ],
  declarations: [FailBlockComponent],
  exports: [FailBlockComponent]
})
export class ConvsMgrFailBlockModule {}
