import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';
import { BotBuilderPageComponent } from './pages/bot-builder/bot-builder.page';

// import { StoryEditorPageComponent } from './pages/story-editor/story-editor.page';

const STORY_EDITOR_ROUTES: Route[] = [
  // Main story detail - stories/:id
  { 
    path: ':story-id', component: BotBuilderPageComponent, canActivate: [IsLoggedInGuard],
    children: [
     { path: 'story-editor', loadChildren: () => import('@app/features/convs-mgr/stories/builder/story-editor').then(m => m.ConvlStoryEditorModule) },
     { path: 'flow-editor', loadChildren: () => import('@app/features/convs-mgr/stories/builder/flow-builder/app').then(m => m.FlowBuilderModule) }
    ]
   },
];

@NgModule({
  imports: [RouterModule.forChild(STORY_EDITOR_ROUTES)],
  exports: [RouterModule]
})
export class BotBuilderRouterModule { }
