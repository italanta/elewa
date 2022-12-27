import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveFormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { AnchorBlockComponent } from './components/anchor-block/anchor-block.component';
import { EndAnchorComponent } from './components/end-anchor/end-anchor.component';

@NgModule({
  imports: [
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MultiLangModule,

    ReactiveFormsModule,

    ConvsMgrBlockOptionsModule,
  ],

  declarations: [
    AnchorBlockComponent,
    EndAnchorComponent,
  ],
  exports: [],
})
export class ConvsMgrAnchorBlockModule {}
