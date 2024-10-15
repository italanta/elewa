import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IvrService, IvrStateModule } from '@app/state/convs-mgr/stories/ivr';

import { StoryEditorStateService } from './providers/story-editor-state.service';

@NgModule({
  imports: [RouterModule, IvrStateModule],
  providers: [StoryEditorStateService, IvrService]
})
export class StoryEditorStateModule
{ }
