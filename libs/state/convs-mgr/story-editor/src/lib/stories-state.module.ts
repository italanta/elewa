import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StoryEditorStateService } from './providers/story-editor-state.service';
import { IvrService, IvrStateModule } from 'ivr';

@NgModule({
  imports: [RouterModule, IvrStateModule],
  providers: [StoryEditorStateService, IvrService]
})
export class StoryEditorStateModule
{ }
