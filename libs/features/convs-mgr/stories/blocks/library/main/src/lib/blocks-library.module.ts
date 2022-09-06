import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { ConvsMgrTextMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/text-message-block';
import { ConvsMgrQuestionBlockModule } from '@app/features/convs-mgr/stories/blocks/library/question-message-block';
import { ConvsMgrLocationMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/location-message-block';
import { ConvsMgrImageMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/image-message-block';
import { ConvsMgrNameMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/name-message-block';


import { BlockComponent } from './components/block/block.component';

import { BlockInjectorService } from './providers/block-injector.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    ReactiveFormsModule,

    ConvlPageModule,
    ConvsMgrTextMessageBlockModule,
    ConvsMgrQuestionBlockModule,
    ConvsMgrLocationMessageBlockModule,
    ConvsMgrImageMessageBlockModule,
    ConvsMgrNameMessageBlockModule,
    ConvsMgrBlockOptionsModule
  ],

  declarations: [
    BlockComponent
  ],

  // Injector which creates all block types within the editor context.
  providers: [BlockInjectorService],
})
export class BlocksLibraryModule {}
