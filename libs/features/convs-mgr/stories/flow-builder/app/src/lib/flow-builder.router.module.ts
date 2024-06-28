import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { FlowBuilderPageComponent } from './pages/story-editor/flow-builder.page';

const STORY_EDITOR_ROUTES: Route[] = [
  // Flow editor - stories/:story-id/flow-editor
  { path: '', component: FlowBuilderPageComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(STORY_EDITOR_ROUTES)],
  exports: [RouterModule]
})
export class FlowBuilderRouterModule { }
