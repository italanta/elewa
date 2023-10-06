import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { StoriesDashboardComponent } from './pages/stories-dashboard/stories-dashboard.component';
import { BotPageComponent } from './pages/bot-page/bot-page.component';

const BOTS_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: StoriesDashboardComponent,
    canActivate: [IsLoggedInGuard],
  },
  { path: ':id', component: BotPageComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(BOTS_ROUTES)],
  exports: [RouterModule],
})
export class ConvsMgrStoriesRouterModule {}
