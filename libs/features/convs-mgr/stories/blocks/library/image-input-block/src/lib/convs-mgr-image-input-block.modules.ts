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

import { ImageInputBlockComponent } from './components/image-input-block/image-input-block.component';

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

  declarations: [ImageInputBlockComponent],

  providers: [],

  exports: [ImageInputBlockComponent],
})
export class ConvsMgrImageInputBlockModule {}