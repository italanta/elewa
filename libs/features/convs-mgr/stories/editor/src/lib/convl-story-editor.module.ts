import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { StoryEditorPageComponent } from './pages/story-editor/story-editor.page';
import { StoryEditorFrameComponent } from './components/editor-frame/editor-frame.component';

import { ConvlStoryEditorRouterModule } from './convs-story-editor.router.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule,

    ConvlStoryEditorRouterModule],

    declarations: [StoryEditorPageComponent, StoryEditorFrameComponent]
})
export class ConvlStoryEditorModule {}
