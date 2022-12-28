import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StoryBlocksStore } from './stores/story-blocks.store';
import { AnchorBlockService } from './services/anchor-story-blocks.service';


@NgModule({
  imports: [RouterModule],
  providers: []
})
export class StoryBlocksStateModule
{
  static forRoot(): ModuleWithProviders<StoryBlocksStateModule>
  {
    return {
      ngModule: StoryBlocksStateModule,
      providers: [
        StoryBlocksStore,
        AnchorBlockService
      ]
    };
  }
}
