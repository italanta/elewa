import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';

import { AnalyticsRouterModule } from './analytics.router.module';

@NgModule({
  imports: [CommonModule, AnalyticsRouterModule],
  declarations: [AnalyticsPageComponent]
})
export class AnalyticsModule {}
