import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { LearnersPageComponent } from './pages/learners-page/learners-page.component';

import { LearnersRouterModule } from './learners.router';
import { BulkActionsModalComponent } from './modals/bulk-actions-modal/bulk-actions-modal.component';
import { ManageClassComponent } from './modals/manage-class/manage-class.component';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    LearnersRouterModule,
    MultiLangModule,
    MaterialBricksModule,
    MaterialDesignModule,
  ],
  declarations: [
    LearnersPageComponent,
    BulkActionsModalComponent,
    ManageClassComponent,
  ],
})
export class ConvsMgrLearnersModule {}
