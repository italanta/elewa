import { Component, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { StoriesDashboardComponent } from './pages/stories-dashboard/stories-dashboard.component';

const STORIES_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: StoriesDashboardComponent, canActivate: [IsLoggedInGuard] },
  // TODO: Update analytics to analytics page
  { path: 'analytics', component: StoriesDashboardComponent, canActivate: [IsLoggedInGuard] },
  {
    path: ':id',
    loadChildren: () => import('libs/features/convs-mgr/stories/editor/src/lib/convl-story-editor.module').then(m => m.ConvlStoryEditorModule),
    canActivate: [IsLoggedInGuard],
    canLoad: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(STORIES_ROUTES)],
  exports: [RouterModule]
})
export class ConvsMgrStoriesRouterModule { }
