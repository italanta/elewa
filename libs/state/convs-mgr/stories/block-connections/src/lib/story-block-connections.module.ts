import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoryConnectionsStore } from './stores/story-connections.store';

@NgModule({
  imports: [CommonModule],
})
export class StoryBlockConnectionsStateModule {
  static forRoot(): ModuleWithProviders<StoryBlockConnectionsStateModule>
  {
    return {
      ngModule: StoryBlockConnectionsStateModule,
      providers: [
        StoryConnectionsStore
      ]
    };
  }
}
