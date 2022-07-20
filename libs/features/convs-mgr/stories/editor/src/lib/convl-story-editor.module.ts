import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { StoryBlockManagerModule } from '@app/features/convs-mgr/stories/blocks/main'
import { BlocksLibraryModule } from '@app/features/convs-mgr/stories/blocks/library';

import { StoryEditorPageComponent }  from './pages/story-editor/story-editor.page';
import { StoryEditorFrameComponent } from './components/editor-frame/editor-frame.component';
import { BlocksLibraryComponent }    from './components/blocks-library/blocks-library.component';

import { StoryEditorInitialiserService } from './providers/story-editor-initialiser.service';

import { ConvlStoryEditorRouterModule } from './convs-story-editor.router.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,

    ConvlPageModule,

    ConvlStoryEditorRouterModule,
    
    StoryBlockManagerModule, BlocksLibraryModule],

    declarations: [StoryEditorPageComponent, 
                      StoryEditorFrameComponent, BlocksLibraryComponent],
    providers: [StoryEditorInitialiserService]
})
export class ConvlStoryEditorModule {}
