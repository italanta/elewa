import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatSnackBarModule
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

    CreateAssessmentPageComponent
  ],
  providers: [
    AssessmentService,
    AssessmentFormService,
    AssessmentQuestionService,
    AssessmentsStore,
    ActiveAssessmentStore,
    AssessmentQuestionStore,
    AssessmentPublishService,
  ],
})
export class ConvsMgrAssessmentsModule {}
