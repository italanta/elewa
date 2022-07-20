import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { BlockInjectorService } from './providers/block-injector.service';

// import { StoryEditorInitialiserService } from './providers/story-editor-initialiser.service';

/** 
 * Module which renders blocks in the story editorr
 */
@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule],

    providers: [BlockInjectorService]
})
export class BlockManagerModule {}
