import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassBasedProgressChartComponent } from './components/class-based-progress-chart/class-based-progress-chart.component';

@NgModule({
  declarations: [ClassBasedProgressChartComponent],
  exports: [ClassBasedProgressChartComponent], 

  imports: [CommonModule],
})
export class ClassBasedProgressModule {}
