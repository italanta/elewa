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
import { ChangeClassComponent } from './modals/change-class/change-class.component';
import { SingleLearnerPageComponent } from './pages/single-learner-page/single-learner-page.component';
import { LearnerInformationComponent } from './components/learner-information/learner-information.component';
import { LearnerEnrolledCoursesComponent } from './components/learner-enrolled-courses/learner-enrolled-courses.component';
import { LearnerAssessmentHistoryComponent } from './components/learner-assessment-history/learner-assessment-history.component';

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
    ChangeClassComponent,
    SingleLearnerPageComponent,
    LearnerInformationComponent,
    LearnerEnrolledCoursesComponent,
    LearnerAssessmentHistoryComponent,
  ],
})
export class ConvsMgrLearnersModule {}
