import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ConvsMgrDashboardModule } from '@app/features/convs-mgr/dashboard';

import { HomeAnalysisContentComponent } from './components/home-analysis-content/home-analysis-content.component';
import { InterestingEventsComponent } from './components/interesting-events/interesting-events.component';
import { HomeSummariesComponent } from './components/home-summaries/home-summaries.component';
import { HomeCoursesComponent } from './components/home-courses/home-courses.component';

import { HomePageComponent } from './pages/home/home.page';

import { ConvsMgrHomeRouterModule } from './convs-mgr-home.router.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    ConvlPageModule,
    ConvsMgrHomeRouterModule,
    MultiLangModule,
    ConvsMgrDashboardModule
  ],

  declarations: [
    HomeSummariesComponent,
    HomeAnalysisContentComponent,
    InterestingEventsComponent,
    HomeCoursesComponent,
    HomePageComponent
  ],

  providers: [],
})
export class ConvsMgrHomeModule {}
