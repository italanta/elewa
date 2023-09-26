import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SurveyHomeComponent } from './pages/survey-home/survey-home.component';
import { SurveyViewComponent } from './pages/survey-view/survey-view.component';
import { SurveyResultsComponent } from './pages/survey-results/survey-results.component';

import { CreateSurveyFlowComponent } from './components/create-survey-flow/create-survey-flow.component';

const SURVEY_ROUTERS: Route[] = [
  {
    path: '',
    component: SurveyHomeComponent,
  },
  {
    path: 'create',
    component: CreateSurveyFlowComponent
  },
  {
    path: ':id',
    component: SurveyViewComponent,
  },
  {
    path: ':id/results',
    component: SurveyResultsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(SURVEY_ROUTERS)],
  exports: [RouterModule]
})
export class SurveysRouterModule { }
