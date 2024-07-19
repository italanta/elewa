import { Injectable } from "@angular/core";
import { SubSink } from "subsink";
import { BehaviorSubject, map } from "rxjs";

import { FlowBuilderStateFrame } from "../model/flow-builder-state-frame.interface";
import { __StoryToFlowFrame } from "../model/story-to-flow-frame.function";

import { WFlowService } from "@app/state/convs-mgr/wflows";

@Injectable({
  providedIn: 'root'
})
export class FlowBuilderStateProvider
{
  private _sbS = new SubSink();

  private _isLoaded = false;
  private _activeInstance?: FlowBuilderStateFrame;

  private _state$$ = new BehaviorSubject<FlowBuilderStateFrame>(null as any);

  constructor(private _flow$$: WFlowService)
  { }

  /** 
   * Initialise a new flow builder state. 
   * This is done on loading of the flow page (ngOnInit).
   */
  async initialize()
  { 
    const [story, flow] = await Promise.all([this._flow$$.get(), 
                                             this._flow$$.getLatestFlowConfig()]);                          
    
    this._activeInstance = __StoryToFlowFrame(story, flow);

    this._state$$.next(this._activeInstance);

    return this._state$$;
  }

  /**
   * @returns The active instance, if set.
   */
  get() {
    return this._state$$.asObservable().pipe(map(s => s != null));
  }


  /** Done at ngOnDelete of Flow builder page. Used to avoid memory leaks at the flow level. */
  unset() {
    this._isLoaded = false;
    this._activeInstance = undefined;
    this._state$$ =  new BehaviorSubject<FlowBuilderStateFrame>(null as any);  

    this._sbS.unsubscribe();
    this._sbS = new SubSink();
  }
}