import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { FLOW_CONTROLS, FlowControl } from "./flow-controls.const";

/**
 * Manages the state of flow controls.
 */

@Injectable()
export class FlowEditorStateProvider {
  /** Initial list of control state for the editor */
  private _controls = FLOW_CONTROLS();
  
  /** BehaviorSubject to track changes in control state */
  private _controls$$ = new BehaviorSubject<FlowControl[]>([]);

  constructor() { }

   /**
   * Gets the BehaviorSubject for controls.
   */
   get(): Observable<FlowControl[]> {
    return this._controls$$.asObservable();
  }

  /**
   * Updates the list of controls and notifies subscribers.
   * @param controls - The new list of controls.
   */
  setControls(control: FlowControl) {
    const current = this._controls$$.getValue()
    current.push(control)
    this._controls$$.next(current);
  }


}
