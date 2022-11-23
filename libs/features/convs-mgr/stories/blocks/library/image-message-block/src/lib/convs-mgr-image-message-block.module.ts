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

import { ImageBlockComponent } from './components/image-block/image-block.component';

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

  declarations: [ImageBlockComponent],

  providers: [],

  exports: [ImageBlockComponent],
})
export class ConvsMgrImageMessageBlockModule {}