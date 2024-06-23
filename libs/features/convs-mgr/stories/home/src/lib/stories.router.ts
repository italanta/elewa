import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessBotsGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';
import { BotResolverService } from '@app/elements/layout/ital-bread-crumb';
import { Bot } from '@app/model/convs-mgr/bots';

import { BotPageComponent } from './pages/bot-page/bot-page.component';
import { CoursesViewAllPageComponent } from './pages/courses-view-all-page/courses-view-all-page.component';
import { StoriesDashboardComponent } from './pages/stories-dashboard/stories-dashboard.component';

const BOTS_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: StoriesDashboardComponent,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'view-all',
    component: CoursesViewAllPageComponent,
    data: { breadCrumb: 'All-Bots' },
    canActivate: [IsLoggedInGuard],
  },
  {
    path: ':id',
    component: BotPageComponent,
    data: { breadCrumb: (data: { bot: Bot }) => `${data.bot.name}` },
    resolve: { bot: BotResolverService },
    canActivate: [IsLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(BOTS_ROUTES)],
  exports: [RouterModule],
})
export class ConvsMgrStoriesRouterModule {}
