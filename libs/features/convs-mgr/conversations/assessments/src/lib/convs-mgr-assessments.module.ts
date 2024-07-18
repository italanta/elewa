import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 

import {
  ActiveAssessmentStore,
  AssessmentPublishService,
  AssessmentQuestionService,
  AssessmentQuestionStore,
  AssessmentService,
  AssessmentsStore,
} from '@app/state/convs-mgr/conversations/assessments';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';
import { ClmMicroAppLayoutModule } from '@app/elements/layout/clm-micro-app';

import { AssessmentsRouterModule } from './assessments.router.module';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentResultsComponent } from './pages/assessment-results/assessment-results.component';

import { DeleteAssessmentModalComponent } from './modals/delete-assessment-modal/delete-assessment-modal.component';

import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { AssessmentQuestionsComponent } from './components/assessment-questions/assessment-questions.component';
import { AssessmentQuestionComponent } from './components/assessment-question/assessment-question.component';
import { AssessmentQuestionFormComponent } from './components/assessment-question-form/assessment-question-form.component';
import { AssessmentAnswerComponent } from './components/assessment-answer/assessment-answer.component';
import { AssessmentQuestionFormsComponent } from './components/assessment-question-forms/assessment-question-forms.component';
import { AssessmentAnswersComponent } from './components/assessment-answers/assessment-answers.component';
import { AssessmentConfigComponent } from './components/assessment-config/assessment-config.component';
import { AssessmentsHeaderComponent } from './components/assessments-header/assessments-header.component';
import { AssessmentsGridViewComponent } from './components/assessments-grid-view/assessments-grid-view.component';
import { AssessmentsListViewComponent } from './components/assessments-list-view/assessments-list-view.component';
import { CreateAssessmentPageComponent } from './components/create-assessment-flow/create-assessment-page/create-assessment-page.component';

import { AssessmentFormService } from './services/assessment-form.service';
import { AssessmentCardComponent } from './components/assessment-card/assessment-card.component';
import { AssessmentFailedSectionComponent } from './components/assessment-failed-section/assessment-failed-section.component';
import { AssessmentHeaderComponent } from './components/assessment-header/assessment-header.component';
import { AssessmentResultBannerComponent } from './components/assessment-result-banner/assessment-result-banner.component';
import { ContentSectionComponent } from './components/content-section/content-section.component';
import { SingleQuestionFormComponent } from './components/single-question-form/single-question-form.component';
import { AllQuestionsFormComponent } from './components/all-questions-form/all-questions-form.component';

@NgModule({
  imports: [
    CommonModule,
    AssessmentsRouterModule,
    MaterialBricksModule,
    MaterialDesignModule,
    MultiLangModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ConvlPageModule,
    FlexLayoutModule,
    MatSnackBarModule,
    DragDropModule,
    ItalBreadCrumbModule,
    ClmMicroAppLayoutModule
  ],
  declarations: [
    AssessmentsHomeComponent,
    AssessmentListComponent,
    AssessmentViewComponent,
    AssessmentQuestionComponent,
    AssessmentViewComponent,
    AssessmentQuestionsComponent,
    AssessmentQuestionFormsComponent,
    AssessmentQuestionFormComponent,
    AssessmentAnswersComponent,
    AssessmentAnswerComponent,
    AssessmentConfigComponent,
    AssessmentResultsComponent,
    DeleteAssessmentModalComponent,
    AssessmentsHeaderComponent,
    AssessmentsGridViewComponent,
    AssessmentsListViewComponent,

    //Micro-App Assessments
    AssessmentCardComponent,
    AssessmentFailedSectionComponent,
    AssessmentHeaderComponent,
    AssessmentResultBannerComponent,
    ContentSectionComponent,
    SingleQuestionFormComponent,
    AllQuestionsFormComponent,

    CreateAssessmentPageComponent,
  ],
  
  providers: [
    AssessmentService,
    AssessmentFormService,
    AssessmentsStore,
    AssessmentPublishService,
  ],
  exports: [
    ContentSectionComponent
  ]
})
export class ConvsMgrAssessmentsModule {}
