import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { StoryEditorInitialiserService } from './providers/story-editor-initialiser.service';

/** 
 * Module which configures the story-editor by 
 *    initialising the frame and preloading the previously saved state.
 * 
 * Initialises the story-editor-frame-model which manages the state of the editor.
 */
@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule],

    providers: [StoryEditorInitialiserService]
})
export class StoryBlockManagerModule {}
