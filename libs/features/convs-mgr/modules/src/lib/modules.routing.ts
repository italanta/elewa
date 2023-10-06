import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ModulesDashboardComponent } from './pages/modules-dashboard/modules-dashboard.component';

const MODULES_ROUTER: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: ModulesDashboardComponent,
    canActivate: [IsLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(MODULES_ROUTER)],
  exports: [RouterModule],
})
export class ConvsMgrModulesRouterModule {}
