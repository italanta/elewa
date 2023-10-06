import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

const MODULES_ROUTER: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(MODULES_ROUTER)],
  exports: [RouterModule],
})
export class ConvsMgrModulesRouterModule {}
