import { SubSink } from "subsink";
import { BehaviorSubject, combineLatest, filter, map, Observable } from "rxjs";

import { FlowBuilderStateFrame } from "../model/flow-builder-state-frame.interface";
import { __StoryToFlowFrame, _CreateScreen } from "../model/story-to-flow-frame.function";

import { WFlowService } from "@app/state/convs-mgr/wflows";
import { FlowControl, FlowScreenV31 } from "@app/model/convs-mgr/stories/flows";

export class FlowBuilderStateProvider
{
  private _sbS = new SubSink();

  private _isLoaded = false;
  private _activeInstance?: FlowBuilderStateFrame;

  /** Index of the active screen. For now it will only show the first screen */
  activeScreen$ = new BehaviorSubject<number>(0);
  screens$: Observable<FlowScreenV31[]>;

  /** BehaviorSubject to track changes in control state */
  private _controls$$ = new BehaviorSubject<FlowControl[]>([]);

  private _state$$ = new BehaviorSubject<FlowBuilderStateFrame>(null as any);
  _state = this._state$$.asObservable();

  constructor(private _flow$$: WFlowService)
  { this.init().subscribe(); }

  /** 
   * Initialise a new flow builder state. 
   * This is done on loading of the flow page (ngOnInit).
   */
  init()
  {
    const flow$ = this._flow$$.get();
    const flowConfig$ = this._flow$$.getFlowConfig();

    return combineLatest([flow$, flowConfig$]).pipe(map(([story, flow]) =>
    {
      this._activeInstance = __StoryToFlowFrame(story, flow);
      this._state$$.next(this._activeInstance);
      // debugger
      return this._activeInstance;
    }));

    // const story = await this._flow$$.get();

    // const [story, flow] = await Promise.all([this._flow$$.get(), 
    //                                          this._flow$$.getLatestFlowConfig()]);    

    // this._activeInstance = __StoryToFlowFrame(story, flow);

    // this._state$$.next(this._activeInstance);

    // return this._state$$.asObservable();
  }

  addScreen()
  {
    const state = this._state$$.getValue();
    const currentScreen = this.activeScreen$.getValue();
    const newScreenIndex = currentScreen + 1;

    const newScreen = _CreateScreen(state.story.id as string, newScreenIndex + 1);

    state.flow.flow.screens.push(newScreen);
    // Update the state with the current screens
    this._state$$.next(state);

    // Move the user to the new screen
    this.activeScreen$.next(newScreenIndex);
  }

  /**
   * @returns The active instance, if set.
   */
  get()
  {
    return this._state$$.pipe(filter(s => s != null));
  }

  /**
  * Gets the BehaviorSubject for controls.
  */
  getControls(): Observable<FlowControl[]>
  {
    return this._controls$$.asObservable();
  }

  /**
   * Updates the list of controls and notifies subscribers.
   * @param controls - The new list of controls.
   */
  setControls(control: FlowControl)
  {
    const current = this._controls$$.getValue();
    current.push(control);
    this._controls$$.next(current);
  }



  /** Done at ngOnDelete of Flow builder page. Used to avoid memory leaks at the flow level. */
  unset()
  {
    this._isLoaded = false;
    this._activeInstance = undefined;
    this._state$$ = new BehaviorSubject<FlowBuilderStateFrame>(null as any);

    this._sbS.unsubscribe();
    this._sbS = new SubSink();
  }
}