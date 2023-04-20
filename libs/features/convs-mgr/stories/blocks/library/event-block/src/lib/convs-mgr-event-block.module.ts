import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { EventBlockComponent } from './components/event-block/event-block.component';
import { MultiLangModule } from '@ngfi/multi-lang';
import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@NgModule({
  imports: [CommonModule,  
            MultiLangModule,  
            MaterialDesignModule,
            FlexLayoutModule,
            MaterialBricksModule,

            FormsModule,
            ReactiveFormsModule,
            ConvsMgrBlockOptionsModule
  ],
  declarations: [EventBlockComponent],

  exports: [EventBlockComponent]
})
export class ConvsMgrEventBlockModule {}
