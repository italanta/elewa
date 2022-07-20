import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { BlockComponent } from './components/block/block.component';
import { MessageBlockComponent } from './components/message-block/message-block.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ReactiveFormsModule,

    ConvlPageModule],

    declarations: [BlockComponent, MessageBlockComponent],
    exports: [BlockComponent, MessageBlockComponent]
})
export class BlocksLibraryModule {}
