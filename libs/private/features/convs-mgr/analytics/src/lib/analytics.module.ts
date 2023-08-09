import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

import { AnalyticsRouterModule } from './analytics.router.module';
import { SafePipe } from './pages/safe.pipe';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';

@NgModule({
  imports: [CommonModule, AnalyticsRouterModule, ConvlPageModule],
  declarations: [DashboardPageComponent, ReportsPageComponent, AnalyticsPageComponent, SafePipe],
})
export class AnalyticsModule {}
