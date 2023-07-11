import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';

const ANALYTICS_ROUTES: Route[] = [
  {
    path: '',
    component: AnalyticsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ANALYTICS_ROUTES)],
  exports: [RouterModule]
})
export class AnalyticsRouterModule { }
