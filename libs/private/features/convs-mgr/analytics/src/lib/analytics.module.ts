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
  declarations: [DashboardPageComponent, ReportsPageComponent],
})
export class AnalyticsModule {}
