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
  AssessmentPublishService,
  AssessmentQuestionBankStore,
  AssessmentService,
  AssessmentsStore,
} from '@app/state/convs-mgr/conversations/assessments';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ItalBreadCrumbModule } from '@app/elements/layout/ital-bread-crumb';
import { ClmMicroAppLayoutModule } from '@app/elements/layout/clm-micro-app';
import { CustomComponentsModule } from '@app/elements/layout/convs-mgr/custom-components';
import { ElementsLayoutModalsModule } from '@app/elements/layout/modals';
import { AssessmentsRouterModule } from './assessments.router.module';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentResultsPageComponent } from './pages/assessment-results-page/assessment-results-page.component';

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

import { LegacyAssessmentResultsComponent } from './components/legacy-assessment-results/legacy-assessment-results.component';
import { AssessmentCardComponent } from './components/assessment-card/assessment-card.component';
import { AssessmentFeedbackSectionComponent } from './components/assessment-feedback-section/assessment-feedback-section.component';
import { AssessmentHeaderComponent } from './components/assessment-header/assessment-header.component';
import { AssessmentResultBannerComponent } from './components/assessment-result-banner/assessment-result-banner.component';
import { ContentSectionComponent } from './components/content-section/content-section.component';
import { SingleQuestionFormComponent } from './components/single-question-form/single-question-form.component';
import { AllQuestionsFormComponent } from './components/all-questions-form/all-questions-form.component';
import { AssessmentLandingPageComponent } from './components/micro-app-assessment-landing-page/assessment-landing-page.component';
import { AssessmentMediaUploadComponent } from './components/assessment-media-upload/assessment-media-upload.component';
import { AssessmentPreviewPageComponent } from './pages/assessment-preview-page/assessment-preview-page.component';
import { AssessmentResultsComponent } from './components/assessment-results/assessment-results.component';
import { CompletionTimeComponent } from './components/assessment-results-components/completion-time/completion-time.component';
import { ProgressPieChartComponent } from './components/assessment-results-components/progress-pie-chart/progress-pie-chart.component';
import { DistributionBarChartComponent } from './components/assessment-results-components/distribution-bar-chart/distribution-bar-chart.component';
import { AssessmentUsersTableComponent } from './components/assessment-results-components/assessment-users-table/assessment-users-table.component';
import { MediaUploadModalComponent } from './modals/media-upload-modal/media-upload.component';
import { MicroAppsQuestionFormComponent } from './components/micro-apps-question-card/micro-apps-question-form.component';

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
    ClmMicroAppLayoutModule,
    CustomComponentsModule,
    ElementsLayoutModalsModule,
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
    AssessmentResultsPageComponent,
    LegacyAssessmentResultsComponent,
    DeleteAssessmentModalComponent,
    AssessmentsHeaderComponent,
    AssessmentsGridViewComponent,
    AssessmentsListViewComponent,
    AssessmentResultsComponent,
    MediaUploadModalComponent,

    //Micro-App Assessments
    AssessmentCardComponent,
    AssessmentFeedbackSectionComponent,
    AssessmentHeaderComponent,
    AssessmentResultBannerComponent,
    ContentSectionComponent,
    SingleQuestionFormComponent,
    AllQuestionsFormComponent,

    CreateAssessmentPageComponent,
    AssessmentLandingPageComponent,
    AssessmentMediaUploadComponent,
    AssessmentPreviewPageComponent,
    CompletionTimeComponent,
    ProgressPieChartComponent,
    DistributionBarChartComponent,
    AssessmentUsersTableComponent,
    MicroAppsQuestionFormComponent,
  ],

  providers: [
    AssessmentService,
    AssessmentFormService,
    AssessmentsStore,
    AssessmentPublishService,
    AssessmentQuestionBankStore,
  ],
  exports: [
    ContentSectionComponent,
    AssessmentLandingPageComponent,
    AssessmentQuestionFormComponent,
    AssessmentAnswersComponent,
  ],
})
export class ConvsMgrAssessmentsModule {}
