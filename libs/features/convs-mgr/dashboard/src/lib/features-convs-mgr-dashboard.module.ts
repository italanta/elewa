import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { ActionsListomponent } from './components/actions-list/actions-list.component';
import { TrainerStatsComponent } from './components/trainer-stats/trainer-dashboard-stats.component';
import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';
import { DashboardPage } from './pages/dashboard/dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    ConvlPageModule
  ],
  declarations: [
    DashboardPage,
    
    ActionsListomponent,
    TrainerStatsComponent
  ]
})
export class FeaturesConvsMgrDashboardModule {}
