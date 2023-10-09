import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MaterialDesignModule,
  MaterialBricksModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { GroupBasedProgressChartComponent } from './components/group-based-progress-chart/group-based-progress-chart.component';
import { AssessmentProgressChartComponent } from './components/assessment-progress-chart/assessment-progress-chart.component';
import { EnrolledUserProgressChartComponent } from './components/enrolled-user-progress-chart/enrolled-user-progress-chart.component';

@NgModule({
  declarations: [
    GroupBasedProgressChartComponent,
    AssessmentProgressChartComponent,
    EnrolledUserProgressChartComponent,
  ],
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    MultiLangModule,
  ],
  exports: [
    GroupBasedProgressChartComponent,
    AssessmentProgressChartComponent,
    EnrolledUserProgressChartComponent,
  ],
})
export class GroupBasedProgressModule {}
