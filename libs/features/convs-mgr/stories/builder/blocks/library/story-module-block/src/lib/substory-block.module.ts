import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';

import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/builder/blocks/library/block-options';
import { StoryModuleBlockComponent } from './components/story-module-block/story-module-block.component';
import { CreateModuleModalComponent } from './components/create-module-modal/create-module-modal.component';


@NgModule({
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

  declarations: [StoryModuleBlockComponent, CreateModuleModalComponent],
  exports: [StoryModuleBlockComponent],
})
export class StoryModuleBlockModule {}
