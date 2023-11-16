import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { SurveyQuestionComponent } from './components/survey-question/survey-question.component';
import { SurveyQuestionFormComponent } from './components/survey-question-form/survey-question-form.component';
import { SurveyAnswerComponent } from './components/survey-answer/survey-answer.component';
import { SurveyAnswersComponent } from './components/survey-answers/survey-answers.component';
import { SurveyConfigComponent } from './components/survey-config/survey-config.component';
import { SurveyListComponent } from './components/survey-list/survey-list.component';
import { SurveyQuestionFormsComponent } from './components/survey-question-forms/survey-question-forms.component';
import { SurveyQuestionsComponent } from './components/survey-questions/survey-questions.component';
import { SurveyGridViewComponent } from './components/survey-grid-view/survey-grid-view.component';
import { SurveyHeaderComponent } from './components/survey-header/survey-header.component';
import { SurveyListViewComponent } from './components/survey-list-view/survey-list-view.component';
import { SurveyResultsComponent } from './pages/survey-results/survey-results.component';
import { SurveyViewComponent } from './pages/survey-view/survey-view.component';
import { SurveyHomeComponent } from './pages/survey-home/survey-home.component';
import { DeleteSurveyModalComponent } from './modals/delete-survey-modal/delete-survey-modal.component';
import { SurveysRouterModule } from './surveys.router.module';
import { CreateSurveyFlowComponent } from './components/create-survey-flow/create-survey-flow.component';
import { SurveyResponsesComponent } from './pages/survey-responses/survey-responses.component';
import { SurveyLearnersComponent } from './components/survey-learners/survey-learners.component';
import { SurveySummaryComponent } from './components/survey-summary/survey-summary.component';
import { HorizontalBarComponent } from './components/graphs/horizontal-bar/horizontal-bar.component';
import { PieComponent } from './components/graphs/pie/pie.component';
import { SendModalComponent } from './modals/send-modal/send-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SurveysRouterModule,
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
  ],
  declarations: [
    SurveyQuestionComponent,
    SurveyQuestionFormComponent,
    SurveyAnswerComponent,
    SurveyAnswersComponent,
    SurveyConfigComponent,
    SurveyListComponent,
    SurveyQuestionFormsComponent,
    SurveyQuestionsComponent,
    SurveyGridViewComponent,
    SurveyHeaderComponent,
    SurveyListViewComponent,
    CreateSurveyFlowComponent,
    SurveyResultsComponent,
    SurveyViewComponent,
    SurveyHomeComponent,
    DeleteSurveyModalComponent,
    SurveyResponsesComponent,
    SurveyLearnersComponent,
    SurveySummaryComponent,
    HorizontalBarComponent,
    PieComponent,
    SendModalComponent,
  ]
})
export class ConvsMgrSurveysModule {}
