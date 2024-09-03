import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { DocumentBlockComponent } from './components/document-block/document-block.component';
import { DocumentBlockFormComponent } from './components/document-block-form/document-block-form.component';

@NgModule({
  declarations: [DocumentBlockComponent, DocumentBlockFormComponent],
  exports: [DocumentBlockComponent],
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
export class ConvsMgrDocumentMessageBlockModule {}
