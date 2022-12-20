import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { StoryEditorStateModule } from '@app/state/convs-mgr/story-editor';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { BlocksLibraryModule } from '@app/features/convs-mgr/stories/blocks/library/main';
import { ConvsMgrAnchorBlockModule } from '@app/features/convs-mgr/stories/blocks/library/anchor-block'

import { StoryEditorFrameComponent } from './components/editor-frame/editor-frame.component';
import { BlocksLibraryComponent } from './components/blocks-library/blocks-library.component';

import { StoryEditorPageComponent } from './pages/story-editor/story-editor.page';

import { StoryEditorInitialiserService } from './providers/story-editor-initialiser.service';
import { ManageChannelStoryLinkService } from './providers/manage-channel-story-link.service';

import { AddBotToChannelModal } from './modals/add-bot-to-channel-modal/add-bot-to-channel.modal';

import { ConvlStoryEditorRouterModule } from './convs-story-editor.router.module';

@NgModule({
  imports: [
    CommonModule, MultiLangModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,
    MaterialFormBricksModule, FormsModule, ReactiveFormsModule,
    ConvlPageModule, ConvsMgrAnchorBlockModule,
    BlocksLibraryModule, StoryEditorStateModule,

    ConvlStoryEditorRouterModule
  ],

  declarations: [
    StoryEditorPageComponent, AddBotToChannelModal,
    StoryEditorFrameComponent, BlocksLibraryComponent
  ],

  providers: [
    StoryEditorInitialiserService, ManageChannelStoryLinkService
  ]
})
export class ConvlStoryEditorModule { }
