import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { VideoBlockComponent } from './components/video-block/video-block.component';
import { VideoUploadModalComponent } from './modals/video-upload-modal/video-upload-modal.component';
import { FileStorageService } from '@app/state/file';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,
    ConvsMgrBlockOptionsModule,

    TranslateModule.forRoot(),
  ],
  declarations: [VideoBlockComponent, VideoUploadModalComponent],
  exports: [VideoBlockComponent, VideoUploadModalComponent],
  providers: [FileStorageService],
})
export class ConvsMgrVideoMessageBlockModule {}
