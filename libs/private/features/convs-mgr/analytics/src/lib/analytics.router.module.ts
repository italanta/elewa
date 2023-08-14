import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

const ANALYTICS_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'reports',
    component: ReportsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ANALYTICS_ROUTES)],
  exports: [RouterModule],
})
export class AnalyticsRouterModule {}
