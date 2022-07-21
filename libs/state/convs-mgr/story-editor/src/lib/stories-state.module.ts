import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoryEditorStateService } from './providers/story-editor-state.service';

@NgModule({
  imports: [CommonModule,
             RouterModule],

  providers: [StoryEditorStateService]
})
export class StoryEditorStateModule
{}
