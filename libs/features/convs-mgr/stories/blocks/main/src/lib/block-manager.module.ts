import { NgModule } from '@angular/core';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

/** 
 * Unused placeholder for later functionality.
 */
@NgModule({
  imports: [
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule],

    providers: []
})
export class BlockManagerModule {}
