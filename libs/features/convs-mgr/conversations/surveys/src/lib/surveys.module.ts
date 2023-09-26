import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SurveyAssessmentFlowComponent } from './components/survey-assessment-flow/survey-assessment-flow.component';
import { SurveyResultsComponent } from './pages/survey-results/survey-results.component';
import { SurveyViewComponent } from './pages/survey-view/survey-view.component';
import { SurveyHomeComponent } from './pages/survey-home/survey-home.component';
import { DeleteSurveyModalComponent } from './modals/delete-survey-modal/delete-survey-modal.component';

@NgModule({
  imports: [CommonModule],
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
    SurveyAssessmentFlowComponent,
    SurveyResultsComponent,
    SurveyViewComponent,
    SurveyHomeComponent,
    DeleteSurveyModalComponent,
  ],
})
export class FeaturesConvsMgrConversationsSurveysModule {}
