import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoryConnectionsStore } from './stores/story-connections.store';

@NgModule({
  imports: [CommonModule],
})
export class StroyBlockConnectionsStateModule {
  static forRoot(): ModuleWithProviders<StroyBlockConnectionsStateModule>
  {
    return {
      ngModule: StroyBlockConnectionsStateModule,
      providers: [
        StoryConnectionsStore
      ]
    };
  }
}
