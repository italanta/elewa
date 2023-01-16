import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StoryEditorStateService } from './providers/story-editor-state.service';

@NgModule({
  imports: [RouterModule],
  providers: [StoryEditorStateService]
})
export class StoryEditorStateModule
{ }
