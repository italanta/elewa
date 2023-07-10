import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { LearnersPageComponent } from './pages/learners-page/learners-page.component';

const ASSESSMENTS_ROUTES: Route[] = [
  {
    path: '',
    component: LearnersPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTES)],
  exports: [RouterModule]
})
export class AnalyticsRouterModule { }
