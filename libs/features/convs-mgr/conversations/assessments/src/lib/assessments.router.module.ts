import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentResultsComponent } from './pages/assessment-results/assessment-results.component';

import { CreateAssessmentPageComponent } from './components/create-assessment-flow/create-assessment-page/create-assessment-page.component';

const ASSESSMENTS_ROUTERS: Route[] = [
  {
    path: '',
    component: AssessmentsHomeComponent,
  },
  {
    path: 'create',
    component: CreateAssessmentPageComponent
  },
  {
    path: ':id',
    component: AssessmentViewComponent,
  },
  {
    path: ':id/results',
    component: AssessmentResultsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTERS)],
  exports: [RouterModule]
})
export class AssessmentsRouterModule { }
