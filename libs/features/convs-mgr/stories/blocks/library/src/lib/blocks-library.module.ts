import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { BlocksLibraryComponent } from './components/blocks-library/blocks-library.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule],

    declarations: [BlocksLibraryComponent],
    exports: [BlocksLibraryComponent]
})
export class BlocksLibraryModule {}
