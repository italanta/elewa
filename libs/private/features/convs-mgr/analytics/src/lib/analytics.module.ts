import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { GroupBasedProgressModule } from '@app/features/monitoring';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

import { AnalyticsRouterModule } from './analytics.router.module';
import { SafePipe } from './pages/safe.pipe';

@NgModule({
  imports: [CommonModule, AnalyticsRouterModule, ConvlPageModule, GroupBasedProgressModule],
  declarations: [DashboardPageComponent, ReportsPageComponent, SafePipe],
})
export class AnalyticsModule {}
