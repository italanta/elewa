import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { MultiLangModule } from '@ngfi/multi-lang';
import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { AudioBlockComponent } from './components/audio-block/audio-block.component';
import { AudioBlockFormComponent } from './components/audio-block-form/audio-block-form.component';

@NgModule({
  declarations: [AudioBlockComponent, AudioBlockFormComponent],
  exports: [AudioBlockComponent],
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
export class ConvsMgrAudioMessageBlockModule {}
