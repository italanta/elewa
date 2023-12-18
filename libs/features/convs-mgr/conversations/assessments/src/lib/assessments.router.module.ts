import { AssessmentResolverService } from './../../../../../../elements/layout/ital-bread-crumb/src/lib/resolvers/assessments.resolver.service';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentResultsComponent } from './pages/assessment-results/assessment-results.component';
import { CreateAssessmentPageComponent } from './components/create-assessment-flow/create-assessment-page/create-assessment-page.component';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';




const ASSESSMENTS_ROUTERS: Route[] = [
  {
    path: '',
    data: { breadCrumb: 'Assessments' },
    component: AssessmentsHomeComponent,
  },
  {
    path: 'create',
    component: CreateAssessmentPageComponent
  },
  {
    path: ':id',
    component: CreateAssessmentPageComponent,
  },
  {
    path: ':id/results',
    component: AssessmentResultsComponent,
    resolve:{
      assessment: AssessmentResolverService
    },
    data: {breadCrumb: (data: {assessment: Assessment}) =>  `${data.assessment.title} > Results`}
  }
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTERS)],
  exports: [RouterModule]
})
export class AssessmentsRouterModule { }
