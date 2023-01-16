import { ModuleWithProviders, NgModule } from '@angular/core';

import { StoryConnectionsStore } from './stores/story-connections.store';

@NgModule({
  imports: [],
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
