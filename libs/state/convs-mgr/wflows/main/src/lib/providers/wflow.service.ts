import { map, take } from "rxjs";

import { Injectable } from "@angular/core";
import { ActiveStoryStore } from "@app/state/convs-mgr/stories";
import { StoryModuleTypes } from "@app/model/convs-mgr/stories/main";
import { FlowStory } from "@app/model/convs-mgr/stories/flows";


@Injectable()
export class WFlowService
{
  constructor(private _activeStory$$: ActiveStoryStore) { }

  /**
   * Get the active flow.
   * 
   * - Not a store, please call at the load of each flow editor - 
   * 
   * @returns {Observable<FlowStory>}
   * @throws if current active story is not set or there's a mismatch in active story type i.e. it's not a flow
   */
  get = () => 
    this._activeStory$$.get()
        .pipe(
          take(1),
          map(s => 
          {
            if(!s)                                throw new Error('No active story');
            if(s.type !== StoryModuleTypes.Flow)  throw new Error('Story is not a flow');

            return s as FlowStory;
          }));
}