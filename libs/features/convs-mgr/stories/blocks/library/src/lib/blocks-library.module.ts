import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { ConvsMgrInputFieldsModule } from '@app/elements/convs-mgr/controls/input-fields';

import { BlockComponent } from './components/block/block.component';
import { MessageBlockComponent } from './components/message-block/message-block.component';

import { BlockInjectorService } from './providers/block-injector.service';
import { QuestionsBlockComponent } from './components/questions-block/questions-block.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    ReactiveFormsModule,

    ConvlPageModule,
    ConvsMgrInputFieldsModule
  ],

  declarations: [
    BlockComponent,
    MessageBlockComponent,
    QuestionsBlockComponent,
  ],

  // Injector which creates all block types within the editor context.
  providers: [BlockInjectorService],
})
export class BlocksLibraryModule {}
