import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';


@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule],

    declarations: [],
    exports: []
})
export class BlocksLibraryModule {}
