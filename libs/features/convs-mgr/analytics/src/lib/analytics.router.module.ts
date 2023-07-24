import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';

const ANALYTICS_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: AnalyticsPageComponent,
  },
  {
    path: 'reports',
    component: AnalyticsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ANALYTICS_ROUTES)],
  exports: [RouterModule],
})
export class AnalyticsRouterModule {}
