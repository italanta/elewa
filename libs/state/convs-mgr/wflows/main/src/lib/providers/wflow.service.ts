import { lastValueFrom, map, Observable, switchMap, take } from "rxjs";

import { DataService } from "@ngfi/angular";
import { Query } from "@ngfi/firestore-qbuilder";

import { Injectable } from "@angular/core";
import { ActiveStoryStore } from "@app/state/convs-mgr/stories";

import { StoryModuleTypes } from "@app/model/convs-mgr/stories/main";
import { FlowStory, WFlow } from "@app/model/convs-mgr/stories/flows";

@Injectable({ providedIn: 'root' })
export class WFlowService
{
  /** 
   * Tracks the latest active story flow 
   * False if 
  */
  private _storyFlowTracker$: Observable<FlowStory | false>;

  constructor(_activeStory$$: ActiveStoryStore,
              private _dataService: DataService) 
  { 
    this._storyFlowTracker$ 
      = _activeStory$$.get()
          .pipe(map(s => s.type === StoryModuleTypes.Flow ? s as FlowStory : false));
  }

  /**
   * Get the active flow.
   * 
   * 
   * - Not a store, please call at the load of each flow editor - 
   * 
   * @returns {Promise<FlowStory>}
   * @throws if current active story is not a flow
   */
  async get() : Promise<FlowStory>
  { 
    return lastValueFrom(
      this._storyFlowTracker$
      .pipe(
        map(s => 
        {
          if(!s) throw new Error('Active story is not a flow story');
          return s;
        })));
  }

  /**
   * Get the latest flow in observable form 
   * @returns {Observable<WFlow | null>}
   */
  getFlowConfig(): Observable<WFlow | undefined>
  {
    return this._storyFlowTracker$
      .pipe(
        take(1),
        switchMap((s) => 
      {
        if(!s) throw new Error('Active story is not a flow story');

        const repo = this._dataService.getRepo<WFlow>(`orgs/${s.orgId}/stories/${s.id}/flow`);
        return repo.getDocuments(
                  new Query().orderBy('timestamp', 'desc')
                             .limit(1))
                    .pipe(map(f => (f && f.length > 0) ? f[0] : undefined));
      }));
  }

  /**
   * Get the latest flow configuration
   * @returns {Promise<WFlow>}
   */
  getLatestFlowConfig() : Promise<WFlow | undefined>
  {
    return lastValueFrom(this.getFlowConfig());
  }
}