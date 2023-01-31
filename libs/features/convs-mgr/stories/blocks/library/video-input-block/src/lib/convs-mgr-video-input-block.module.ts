import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import {MultiLangModule}from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { VideoInputBlockComponent } from './components/video-input-block/video-input-block.component';

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

    ConvsMgrBlockOptionsModule
  ],

  declarations: [VideoInputBlockComponent],

  providers: [],

  exports: [VideoInputBlockComponent],
})
export class ConvsMgrVideoInputBlockModule {}