import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import {MultiLangModule}from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { ImageInputBlockComponent } from './components/image-input-block/image-input-block.component';

@NgModule({ declarations: [ImageInputBlockComponent],
    exports: [ImageInputBlockComponent], imports: [CommonModule,
        MultiLangModule,
        MaterialDesignModule,
        FlexLayoutModule,
        MaterialBricksModule,
        FormsModule,
        ReactiveFormsModule,
        ConvsMgrBlockOptionsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ConvsMgrImageInputBlockModule {}