import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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
   * Gets the current list of controls.
   */
  getControls(): FlowControl[] {
    return [...this._controls]; // Return a copy to avoid external mutation
  }

  /**
   * Updates the list of controls and notifies subscribers.
   * @param controls - The new list of controls.
   */
  setControls(controls: FlowControl[]) {
    this._controls = [...controls];
    this._controls$$.next(this._controls);
  }

  /**
   * Gets the BehaviorSubject for controls.
   */
  getControls$$(): BehaviorSubject<FlowControl[]> {
    return this._controls$$;
  }

  /**
   * Updates a specific control component.
   * @param comp - The control component to update.
   */
  updateComponent(comp: FlowControl) {
    const updatedControls = this._controls.filter(c => c.id !== comp.id);
    updatedControls.push(comp);
    this.setControls(updatedControls);
  }

}
