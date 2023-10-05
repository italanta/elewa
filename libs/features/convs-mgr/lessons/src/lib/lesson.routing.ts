import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { LessonDashboardComponent } from './pages/lesson-dashboard/lesson-dashboard.component';

const STORIES_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: LessonDashboardComponent, canActivate: [IsLoggedInGuard] },
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
export class ConvsMgrLessonsRouterModule { }
