import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { Cmi5BlockComponent } from './components/cmi5-block/cmi5-block.component';




@NgModule({
  imports: [
        CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,

    ConvsMgrBlockOptionsModule
  ],
  declarations: [Cmi5BlockComponent],

  exports :[Cmi5BlockComponent]
})
export class ConvsMgrCMI5BlockModule {}




