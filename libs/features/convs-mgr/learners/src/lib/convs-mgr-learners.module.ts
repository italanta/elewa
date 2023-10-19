import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { MessageTemplateStore, MessageTemplatesService, ScheduleMessageService, ScheduledMessageStore } from '@app/private/state/message-templates';
import { ChannelService, ChannelsStore } from '@app/private/state/organisation/channels';
import { ActiveSurveyStore, SurveyService, SurveysStore } from '@app/state/convs-mgr/conversations/surveys';

import { LearnersPageComponent } from './pages/learners-page/learners-page.component';

import { ChangeClassComponent } from './modals/change-class/change-class.component';
import { BulkActionsModalComponent } from './modals/bulk-actions-modal/bulk-actions-modal.component';
import { CreateClassModalComponent } from './modals/create-class-modal/create-class-modal.component';
import { SingleLearnerPageComponent } from './pages/single-learner-page/single-learner-page.component';
import { LearnerInformationComponent } from './components/learner-information/learner-information.component';
import { LearnerEnrolledCoursesComponent } from './components/learner-enrolled-courses/learner-enrolled-courses.component';
import { LearnerAssessmentHistoryComponent } from './components/learner-assessment-history/learner-assessment-history.component';

import { LearnersRouterModule } from './learners.router';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    LearnersRouterModule,
    MultiLangModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LearnersPageComponent,
    BulkActionsModalComponent,
    ChangeClassComponent,
    CreateClassModalComponent,
    SingleLearnerPageComponent,
    LearnerInformationComponent,
    LearnerEnrolledCoursesComponent,
    LearnerAssessmentHistoryComponent,
  ],
  providers: [
    SurveyService,
    SurveysStore,
    ActiveSurveyStore,
    MessageTemplateStore,
    MessageTemplatesService,
    ScheduledMessageStore,
    ScheduleMessageService,
    ChannelService,
    ChannelsStore
  ]
})
export class ConvsMgrLearnersModule {}
