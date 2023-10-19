import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ModulePageComponent } from './pages/module-page/module-page.component';

const MODULES_ROUTER: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: ':id', component: ModulePageComponent, canActivate: [IsLoggedInGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(MODULES_ROUTER)],
  exports: [RouterModule],
})
export class ConvsMgrModulesRouterModule {}
