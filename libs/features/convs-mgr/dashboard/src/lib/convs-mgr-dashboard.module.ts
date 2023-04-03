import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { GroupBasedProgressModule } from '@app/features/analytics/group-based/progress';

import { DashboardPage } from './pages/dashboard/dashboard.page';

import { ActionsListomponent } from './components/actions-list/actions-list.component';
import { TrainerStatsComponent } from './components/trainer-stats/trainer-dashboard-stats.component';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

@NgModule({
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ConvlPageModule,
    FlexLayoutModule,
    GroupBasedProgressModule
  ],
  declarations: [
    DashboardPage,
    
    ActionsListomponent,
    TrainerStatsComponent
  ],
  exports: [DashboardPage]
})
export class ConvsMgrDashboardModule {}
