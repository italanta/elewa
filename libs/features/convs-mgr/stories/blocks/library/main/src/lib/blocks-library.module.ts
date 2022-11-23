import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { ConvsMgrTextMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/text-message-block';
import { ConvsMgrQuestionBlockModule } from '@app/features/convs-mgr/stories/blocks/library/question-message-block';
import { ConvsMgrLocationMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/location-message-block';
import { ConvsMgrImageMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/image-message-block';
import { ConvsMgrNameMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/name-message-block';
import { ConvsMgrEmailMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/email-message-block';
import { ConvsMgrPhoneMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/phone-message-block';
import { ConvsMgrAudioMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/audio-message-block';
import { ConvsMgrVideoMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/video-message-block';

import { ConvsMgrStickerMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/sticker-message-block';
import { ConvsMgrListMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/list-message-block';
import { ConvsMgrDocumentMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/document-message-block';
import { ConvsMgrReplyMessageBlockModule } from '@app/features/convs-mgr/stories/blocks/library/reply-message-block';

import { FileStateModule, UploadFileService } from '@app/state/file';

import { BlockInjectorService } from './providers/block-injector.service';
import { BlockComponent } from './components/block/block.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    ReactiveFormsModule,

    ConvlPageModule,
    ConvsMgrDocumentMessageBlockModule,
    ConvsMgrTextMessageBlockModule,
    ConvsMgrQuestionBlockModule,
    ConvsMgrReplyMessageBlockModule,
    ConvsMgrLocationMessageBlockModule,
    ConvsMgrImageMessageBlockModule,
    ConvsMgrNameMessageBlockModule,
    ConvsMgrEmailMessageBlockModule,
    ConvsMgrPhoneMessageBlockModule,
    ConvsMgrAudioMessageBlockModule,
    ConvsMgrVideoMessageBlockModule,
    ConvsMgrStickerMessageBlockModule,
    ConvsMgrListMessageBlockModule,
    ConvsMgrBlockOptionsModule,

    FileStateModule
  
  ],

  declarations: [
    BlockComponent
  ],

  // Injector which creates all block types within the editor context.
  providers: [BlockInjectorService, UploadFileService],
})
export class BlocksLibraryModule { }
