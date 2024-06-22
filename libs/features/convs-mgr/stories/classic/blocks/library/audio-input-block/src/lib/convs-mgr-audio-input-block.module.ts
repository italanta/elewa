import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioInputMessageBlockComponent } from './audio-input-message-block/audio-input-message-block.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/classic/blocks/library/block-options';

@NgModule({ declarations: [AudioInputMessageBlockComponent],
    exports: [AudioInputMessageBlockComponent], imports: [CommonModule,
        MultiLangModule,
        MaterialDesignModule,
        FlexLayoutModule,
        MaterialBricksModule,
        FormsModule,
        ReactiveFormsModule,
        ConvsMgrBlockOptionsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ConvsMgrAudioInputBlockModule {}
