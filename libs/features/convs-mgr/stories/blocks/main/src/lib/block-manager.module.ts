import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

/** 
 * Unused placeholder for later functionality.
 */
@NgModule({../../../library/main/src/lib/components/block-edit-modal/block-edit-modal.component
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule],

    providers: []
})
export class BlockManagerModule {}
