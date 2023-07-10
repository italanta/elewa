import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const ASSESSMENTS_ROUTES: Route[] = [
  {
    path: '',
    component: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTES)],
  exports: [RouterModule]
})
export class AnalyticsRouterModule { }
