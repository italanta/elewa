import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { CustomComponentsModule } from '@app/elements/layout/convs-mgr/custom-components';
import { ConvsMgrBlockOptionsModule } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { WebhookBlockComponent } from './components/webhook-block/webhook-block.component';
import { FilterPipe } from './pipes/filter.pipe';

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
    CustomComponentsModule
    ],
  declarations: [WebhookBlockComponent, FilterPipe],
  exports: [WebhookBlockComponent]
})
export class ConvsMgrStoriesWebhookBlockModule {}
