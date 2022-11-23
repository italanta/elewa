import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { AnchorBlockComponent } from './components/anchor-block/anchor-block.component';

@NgModule({
  imports: [
    CommonModule, 
    MaterialDesignModule, 
    FlexLayoutModule, 
    MaterialBricksModule,
    MultiLangModule,
    
    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule
  ],

  declarations: [AnchorBlockComponent],
  exports: [AnchorBlockComponent],
})
export class ConvsMgrAnchorBlockModule {}
