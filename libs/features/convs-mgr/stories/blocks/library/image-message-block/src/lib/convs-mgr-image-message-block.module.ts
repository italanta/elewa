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

import { ImageBlockComponent } from './components/image-block/image-block.component';
import { ImageBlockFormComponent } from './components/image-block-form/image-block-form.component';

@NgModule({ declarations: [ImageBlockComponent, ImageBlockFormComponent],
    exports: [ImageBlockComponent, ImageBlockFormComponent,], imports: [CommonModule,
        MultiLangModule,
        MaterialDesignModule,
        FlexLayoutModule,
        MaterialBricksModule,
        FormsModule,
        ReactiveFormsModule,
        ConvsMgrBlockOptionsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ConvsMgrImageMessageBlockModule {}