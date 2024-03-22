import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';
import { BotModuleResolverService } from '@app/elements/layout/ital-bread-crumb';
import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { ModulePageComponent } from './pages/module-page/module-page.component';

const MODULES_ROUTER: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: ':id',
    component: ModulePageComponent,
    canActivate: [IsLoggedInGuard],
    data: { breadCrumb: (data: { botModule: BotModule }) => `${data.botModule.name}` },
    resolve: { botModule: BotModuleResolverService },
  },
];
@NgModule({
  imports: [RouterModule.forChild(MODULES_ROUTER)],
  exports: [RouterModule],
})
export class ConvsMgrModulesRouterModule {}
