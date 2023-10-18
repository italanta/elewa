import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { StoryEditorStateModule } from '@app/state/convs-mgr/story-editor';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ToastModule } from '@app/elements/layout/toast'

import { BlocksLibraryModule } from '@app/features/convs-mgr/stories/blocks/library/main';
import { ConvsMgrAnchorBlockModule } from '@app/features/convs-mgr/stories/blocks/library/anchor-block'

import { StoryEditorFrameComponent } from './components/editor-frame/editor-frame.component';
import { BlocksLibraryComponent } from './components/blocks-library/blocks-library.component';

import { StoryEditorPageComponent } from './pages/story-editor/story-editor.page';
import { GroupedBlocksComponent } from './components/grouped-blocks/grouped-blocks.component';

import { StoryEditorInitialiserService } from './providers/story-editor-initialiser.service';
import { ManageChannelStoryLinkService } from './providers/manage-channel-story-link.service';

import { AddBotToChannelModal } from './modals/add-bot-to-channel-modal/add-bot-to-channel.modal';

import { ConvlStoryEditorRouterModule } from './convs-story-editor.router.module';
import { PinchZoomDirective } from './directives/app-pinch-zoom.directive';
import { TrackCursorDirective } from './directives/track-cursor.directive';

import { BlockCategoryPipe } from './components/pipes/block-category-pipe.pipe';




@NgModule({
  imports: [
    CommonModule, MultiLangModule, PortalModule, InfiniteScrollModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,
    MaterialFormBricksModule, FormsModule, ReactiveFormsModule,
    ConvlPageModule, ConvsMgrAnchorBlockModule,
    BlocksLibraryModule, StoryEditorStateModule,
    ConvlStoryEditorRouterModule, MatStepperModule,
    ToastModule
  ],

  declarations: [
    StoryEditorPageComponent,
    AddBotToChannelModal,
    StoryEditorFrameComponent,
    GroupedBlocksComponent,
    BlocksLibraryComponent,
    PinchZoomDirective,
    TrackCursorDirective,
    BlockCategoryPipe,
  ],

  providers: [StoryEditorInitialiserService, ManageChannelStoryLinkService],
})
export class ConvlStoryEditorModule { }
