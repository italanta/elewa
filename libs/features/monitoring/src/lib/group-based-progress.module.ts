import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { GroupBasedProgressChartComponent } from './components/group-based-progress-chart/group-based-progress-chart.component';
import { AssessmentProgressChartComponent } from './components/assessment-progress-chart/assessment-progress-chart.component';
import { EnrolledUserProgressChartComponent } from './components/enrolled-user-progress-chart/enrolled-user-progress-chart.component';
import { ProgressCompletionRateChartComponent } from './components/progress-completion-rate-chart/progress-completion-rate-chart.component';

@NgModule({
  declarations: [
    GroupBasedProgressChartComponent,
    AssessmentProgressChartComponent,
    EnrolledUserProgressChartComponent,
    ProgressCompletionRateChartComponent,
  ],
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    MultiLangModule,
    FormsModule,
  ],
  exports: [
    GroupBasedProgressChartComponent,
    AssessmentProgressChartComponent,
    EnrolledUserProgressChartComponent,
    ProgressCompletionRateChartComponent,
  ],
})
export class GroupBasedProgressModule {}
