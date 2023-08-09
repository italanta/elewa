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
import { SingleLearnerPageComponent } from './pages/single-learner-page/single-learner-page.component';

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
    SingleLearnerPageComponent,
  ],
})
export class ConvsMgrLearnersModule {}
