import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';

const ASSESSMENTS_ROUTES: Route[] = [
  {
    path: '',
    component: AnalyticsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ASSESSMENTS_ROUTES)],
  exports: [RouterModule]
})
export class AnalyticsRouterModule { }
