import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoryBlocksStore } from './stores/story-blocks.store';


@NgModule({
  imports: [CommonModule,
             RouterModule],
  providers: []
})
export class StoryBlocksStateModule
{
  static forRoot(): ModuleWithProviders<StoryBlocksStateModule>
  {
    return {
      ngModule: StoryBlocksStateModule,
      providers: [
        StoryBlocksStore
      ]
    };
  }
}
