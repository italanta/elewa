import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentEditComponent } from './pages/assessment-edit/assessment-edit.component';

const ASSESSMENTS_ROUTERS: Route[] = [
  {
    path: '',
    component: AssessmentsHomeComponent,
  },
  {
    path: ':id/view',
    component: AssessmentViewComponent,
  },
  {
    path: ':id/edit',
    component: AssessmentEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTERS)],
  exports: [RouterModule]
})
export class AssessmentsRouterModule { }
