import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { AllCoursesPageComponent } from './pages/all-courses-page/all-courses-page.component';
import { SingleCoursePageComponent } from './pages/single-course-page/single-course-page.component';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsRouterModule,
    ConvlPageModule,
    GroupBasedProgressModule,
    MaterialBricksModule,
    MultiLangModule,
    MaterialDesignModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DashboardPageComponent, ReportsPageComponent, DashboardTopStatsComponent, AllCoursesPageComponent, SingleCoursePageComponent],
})
export class AnalyticsModule {}
