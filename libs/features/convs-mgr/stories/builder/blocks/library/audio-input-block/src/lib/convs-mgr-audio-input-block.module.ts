import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/builder/blocks/library/block-options';

import { AudioInputMessageBlockComponent } from './audio-input-message-block/audio-input-message-block.component';


@NgModule({ 
    declarations: [AudioInputMessageBlockComponent],
    exports: [AudioInputMessageBlockComponent], 

    imports: [  CommonModule,
                MultiLangModule,
                MaterialDesignModule,
                FlexLayoutModule,
                MaterialBricksModule,
                FormsModule,
                ReactiveFormsModule,
                ConvsMgrBlockOptionsModule], 
    
    providers: [provideHttpClient(withInterceptorsFromDi())] 
})
export class ConvsMgrAudioInputBlockModule 
{}
