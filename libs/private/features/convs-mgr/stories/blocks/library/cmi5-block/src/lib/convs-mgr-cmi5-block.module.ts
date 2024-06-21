import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { Cmi5BlockComponent } from './components/cmi5-block/cmi5-block.component';




@NgModule({ declarations: [Cmi5BlockComponent],
    exports: [Cmi5BlockComponent], imports: [CommonModule,
        MultiLangModule,
        MaterialDesignModule,
        FlexLayoutModule,
        MaterialBricksModule,
        FormsModule,
        ReactiveFormsModule,
        ConvsMgrBlockOptionsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ConvsMgrCMI5BlockModule {}




