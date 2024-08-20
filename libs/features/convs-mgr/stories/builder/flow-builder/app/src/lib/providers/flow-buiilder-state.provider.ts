import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FLOW_CONTROLS, FlowControl } from "./flow-controls.const";

/**
 * Unpacks flow state into the builder state.
 */
@Injectable()
export class FlowBuilderStateProvider
{
  /** List of control state for the editor */
  controls = FLOW_CONTROLS();
  /** List of control state for the editor */
  controls$$ = new BehaviorSubject<FlowControl[]>(this.controls);
  
  updateComponent(comp: FlowControl)
  {
    const controls = this.controls.filter(c => c.id !== comp.id)

    controls.push(comp)

    this.controls = controls

    this.controls$$.next(this.controls)
  }
}