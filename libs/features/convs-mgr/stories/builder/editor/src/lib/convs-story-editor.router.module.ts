import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { StoryEditorPageComponent } from './pages/story-editor/story-editor.page';

const STORY_EDITOR_ROUTES: Route[] = [
  // Main story detail - stories/:id
  { path: '', component: StoryEditorPageComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(STORY_EDITOR_ROUTES)],
  exports: [RouterModule]
})
export class ConvlStoryEditorRouterModule { }
