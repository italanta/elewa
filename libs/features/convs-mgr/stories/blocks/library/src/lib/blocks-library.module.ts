import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { MessageBlockComponent } from './components/message-block/message-block.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ReactiveFormsModule,

    ConvlPageModule],

    declarations: [MessageBlockComponent],
    exports: [MessageBlockComponent]
})
export class BlocksLibraryModule {}
