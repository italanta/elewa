import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveysStore } from './stores/surveys.store';
import { SurveyQuestionStore } from './stores/survey-question.store';
import { ActiveSurveyStore } from './stores/active-survey.store';
import { SurveyService } from './services/survey.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyPublishService } from './services/survey-publish.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    SurveysStore,
    SurveyQuestionStore,
    ActiveSurveyStore,
    SurveyService,
    SurveyQuestionService,
    SurveyPublishService
  ]
})
export class StateSurveysModule {}
