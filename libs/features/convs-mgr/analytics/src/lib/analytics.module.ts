import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

import { AnalyticsRouterModule } from './analytics.router.module';

@NgModule({
  imports: [CommonModule, AnalyticsRouterModule, ConvlPageModule],
  declarations: [AnalyticsPageComponent, ReportsPageComponent]
})
export class AnalyticsModule {}
