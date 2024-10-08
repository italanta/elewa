import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { StoryEditorStateModule } from '@app/state/convs-mgr/story-editor';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ToastModule } from '@app/elements/layout/toast'

import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';

import { BlocksLibraryModule } from '@app/features/convs-mgr/stories/blocks/library/main';
import { ConvsMgrAnchorBlockModule } from '@app/features/convs-mgr/stories/blocks/library/anchor-block'

import { StoryEditorFrameComponent } from './components/editor-frame/editor-frame.component';
import { BlocksLibraryComponent } from './components/blocks-library/blocks-library.component';

import { StoryEditorPageComponent } from './pages/story-editor/story-editor.page';
import { GroupedBlocksComponent } from './components/grouped-blocks/grouped-blocks.component';

import { StoryEditorInitialiserService } from './providers/story-editor-initialiser.service';
import { ManageChannelStoryLinkService } from './providers/manage-channel-story-link.service';

import { ConvlStoryEditorRouterModule } from './convs-story-editor.router.module';
import { PinchZoomDirective } from './directives/app-pinch-zoom.directive';
import { TrackCursorDirective } from './directives/track-cursor.directive';

import { BlockCategoryPipe } from './components/pipes/block-category-pipe.pipe';
import { StoryEditorMiniMapComponent } from './components/minimap/minimap.component';
import { SaveStoryService } from './providers/save-story.service';
import { BlockErrorComponent } from './components/block-error/block-error.component';

@NgModule({
  imports: [
    CommonModule, MultiLangModule, PortalModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,
    MaterialFormBricksModule, FormsModule, ReactiveFormsModule,
    ConvlPageModule, ConvsMgrAnchorBlockModule,
    BlocksLibraryModule, StoryEditorStateModule,
    ConvlStoryEditorRouterModule, MatStepperModule,
    ToastModule, ItalBreadCrumbModule
  ],

  declarations: [
    StoryEditorPageComponent,
    StoryEditorFrameComponent,
    GroupedBlocksComponent,
    BlocksLibraryComponent,
    PinchZoomDirective,
    TrackCursorDirective,
    BlockCategoryPipe,
    StoryEditorMiniMapComponent,
    BlockErrorComponent
  ],

  providers: [StoryEditorInitialiserService, SaveStoryService, ManageChannelStoryLinkService],
})
export class ConvlStoryEditorModule { }
