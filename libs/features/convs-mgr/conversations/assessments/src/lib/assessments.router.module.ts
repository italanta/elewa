import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AssessmentResolverService } from '@app/elements/layout/ital-bread-crumb';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
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
    data: { breadCrumb: (data: { assessment: Assessment }) => `${data.assessment.title}` },
    resolve: { assessment: AssessmentResolverService },
    children: [
      {
        path: '',
        component: CreateAssessmentPageComponent,
      },
      {
        path: 'results',
        component: AssessmentResultsComponent,
        data: { breadCrumb: 'Results' },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTERS)],
  exports: [RouterModule]
})
export class AssessmentsRouterModule { }
