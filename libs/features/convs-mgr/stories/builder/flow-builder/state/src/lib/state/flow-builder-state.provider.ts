import { Injectable } from "@angular/core";
import { SubSink } from "subsink";
import { BehaviorSubject, map, take } from "rxjs";

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

import { FlowBuilderStateFrame } from "../model/flow-builder-state-frame.interface";
import { __StoryToFlowFrame } from "../model/story-to-flow-frame.function";


@Injectable()
export class FlowBuilderStateProvider
{
  private _sbS = new SubSink();
  private _isLoaded = false;
  private _activeInstance?: FlowBuilderStateFrame;

  private _state$$ = new BehaviorSubject<FlowBuilderStateFrame>(null as any);

  constructor(private _activeStory$$: ActiveStoryStore)
  { }

  /** 
   * Initialise a new flow builder state. 
   * This is done on loading of the flow page (ngOnInit).
   */
  initialize()
  { 
    const story$ = this._activeStory$$.get();

    this._sbS.sink = 
      story$.pipe(
        take(1),
        map(s => __StoryToFlowFrame(s)))
      .subscribe(s => 
      {
        this._activeInstance = s;
        this._state$$.next(s);

        this._isLoaded = true;
      });
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