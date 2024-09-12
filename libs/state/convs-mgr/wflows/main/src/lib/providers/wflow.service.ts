import { Injectable } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/compat/functions";

import { lastValueFrom, map, Observable, of, switchMap, take } from "rxjs";

import { DataService } from "@ngfi/angular";
import { Query } from "@ngfi/firestore-qbuilder";

import { ActiveStoryStore } from "@app/state/convs-mgr/stories";

import { StoryModuleTypes } from "@app/model/convs-mgr/stories/main";
import { FlowStory, WFlow } from "@app/model/convs-mgr/stories/flows";
import { ActiveOrgStore } from "@app/private/state/organisation/main";

import { WhatsappFlowsStore } from "../stores/whatsapp-flow.store";

@Injectable({ providedIn: 'root' })
export class WFlowService
{
  /** 
   * Tracks the latest active story flow 
   * False if 
  */
  private _storyFlowTracker$: Observable<FlowStory | false>;
  activeFlow$: Observable<WFlow | undefined>;

  constructor(_activeStory$$: ActiveStoryStore,
              private _dataService: DataService,
              private _aff: AngularFireFunctions,
              private _activeOrg: ActiveOrgStore,
              private _flowStore: WhatsappFlowsStore
            ) 
  { 
    this._storyFlowTracker$ 
      = _activeStory$$.get()
          .pipe(map(s => s.type === StoryModuleTypes.Flow ? s as FlowStory : false));

   this.activeFlow$ = this.getFlowConfig();
  }

  add(flow: WFlow) {
    return this._flowStore.add(flow);
  }

  /**
   * If its the first time we are creating the flow, we send a request
   *  to whatsapp to get the flow id, then append it to the flow
   *    before saving it to the DB.
   * 
   * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/
   * 
   * @param flow the flow config to be saved
   */
  initFlow(flow: WFlow) {

    return this._activeOrg.get().pipe(
      switchMap((org)=> {
        const payload = {
          flow: flow,
          orgId: org.id
        }
        console.log(payload)
        return this._aff.httpsCallable('createWhatsappFlow')(payload)
      }), 
      switchMap((resp)=> {
        if(resp.success) {
          const whatsappFlowId = resp.flowId;
          flow.flow.id = whatsappFlowId;
          return this.add(flow);
        } else {
          return of(null);
        }
      }))
  }

  /**
   * Get the active flow.
   * 
   * 
   * - Not a store, please call at the load of each flow editor - 
   * 
   * @returns {Observable<FlowStory>}
   * @throws if current active story is not a flow
   */
  get() : Observable<FlowStory>
  { 
    return this._storyFlowTracker$
      .pipe(
        map(s => 
        {
          if(!s) throw new Error('Active story is not a flow story');
          return s;
        }));
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
                    .pipe(map(f => {
                      return (f && f.length > 0) ? f[0] : undefined
                    }));
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