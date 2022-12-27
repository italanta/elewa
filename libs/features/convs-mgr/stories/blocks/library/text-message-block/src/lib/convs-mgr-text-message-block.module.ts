import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { MessageBlockComponent } from './components/message-block/message-block.component';

@NgModule({
  imports: [
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule
  ],

  declarations: [MessageBlockComponent],

  exports: [MessageBlockComponent],
})
export class ConvsMgrTextMessageBlockModule {}
