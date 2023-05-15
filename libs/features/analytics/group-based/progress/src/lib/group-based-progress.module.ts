import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';

import { GroupBasedProgressChartComponent } from './components/group-based-progress-chart/group-based-progress-chart.component';

@NgModule({
  declarations: [GroupBasedProgressChartComponent],
  exports: [GroupBasedProgressChartComponent], 

  imports: [CommonModule, MaterialBricksModule, MaterialDesignModule],
})
export class GroupBasedProgressModule {}
