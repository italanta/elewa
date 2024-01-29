import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { GroupBasedProgressModule } from '@app/features/monitoring';

import {
  MaterialDesignModule,
  MaterialBricksModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

import { AnalyticsRouterModule } from './analytics.router.module';

import { DashboardTopStatsComponent } from './components/dashboard-top-stats/dashboard-top-stats.component';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsRouterModule,
    ConvlPageModule,
    GroupBasedProgressModule,
    MaterialBricksModule,
    MultiLangModule,
    MaterialDesignModule
  ],
  declarations: [DashboardPageComponent, ReportsPageComponent, DashboardTopStatsComponent],
})
export class AnalyticsModule {}
