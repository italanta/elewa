import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StoriesStore } from './stores/stories.store';
import { ActiveStoryStore } from './stores/active-story.store';
import { LabelsStore } from './stores/labels.store';


@NgModule({
  imports: [RouterModule],
  providers: []
})
export class StoriesStateModule
{
  static forRoot(): ModuleWithProviders<StoriesStateModule>
  {
    return {
      ngModule: StoriesStateModule,
      providers: [
        StoriesStore,
        ActiveStoryStore,
        LabelsStore
      ]
    };
  }
}
