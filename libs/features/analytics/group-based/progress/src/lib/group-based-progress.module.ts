import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupBasedProgressChartComponent } from './components/group-based-progress-chart/group-based-progress-chart.component';

@NgModule({
  declarations: [GroupBasedProgressChartComponent],
  exports: [GroupBasedProgressChartComponent], 

  imports: [CommonModule],
})
export class GroupBasedProgressModule {}
