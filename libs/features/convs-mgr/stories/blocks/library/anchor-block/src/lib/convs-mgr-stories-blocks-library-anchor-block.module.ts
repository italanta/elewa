import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnchorBlockComponent } from './components/anchor-block/anchor-block.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { ConvsMgrBlockOptionsModule } from '../../../block-options/src';

@NgModule({
  imports: [
    CommonModule, 
    MaterialDesignModule, 
    FlexLayoutModule, 
    MaterialBricksModule, 
    ConvsMgrBlockOptionsModule
  ],

  declarations: [AnchorBlockComponent],
})
export class AnchorBlockModule {}
