import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { VideoBlockComponent } from './components/video-block/video-block.component';
import { VideoBlockFormComponent } from './components/video-block-form/video-block-form.component';

@NgModule({
  declarations: [
    VideoBlockComponent,
    VideoBlockFormComponent,
  ],
  exports: [VideoBlockComponent],
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,
    ConvsMgrBlockOptionsModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class ConvsMgrVideoMessageBlockModule {}
