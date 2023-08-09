import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

import { AnalyticsRouterModule } from './analytics.router.module';
import { SafePipe } from './pages/safe.pipe';

@NgModule({
  imports: [CommonModule, AnalyticsRouterModule, ConvlPageModule],
  declarations: [DashboardPageComponent, ReportsPageComponent],
})
export class AnalyticsModule {}
